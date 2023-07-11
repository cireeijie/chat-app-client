import { useEffect, useState } from 'react'
import api from '../api/user'
import Contacts from '../components/contacts'
import Conversation from '../components/conversation'
import '../assets/messages.css'
import { useNavigate } from 'react-router-dom'
import Loading from '../components/loading'

const Messages = () => {
    const [ contactList, setContactList ] = useState();
    const [ message, setMessage ] = useState();
    const [ conversation, setConversation ] = useState([]);
    const [ response, setResponse ] = useState([{status: 'failed', message: 'Send a message now to your contacts'}]);
    const [conversationId, setConversationId ] = useState();
    const [ firstClick, setFirstClick ] = useState(true);
    const [ loadingMessage, setLoadingMessage ] = useState();
    const [ isLoading, setIsLoading ] = useState(false);
    const [ userContacts, setUserContacts ] = useState();
    const navigateTo = useNavigate();

    const getContacts = async () => {
        try {
           await api.get('/api/conversation')
            .then(res => {
                if(res.data.status == 'success') {
                    setContactList(res.data.contacts);
                }
                else {
                    setMessage(res.data.message);
                }
            })
            .catch(err => {
                console.error(err)
            })
        }
        catch(err) {
            console.error(err)
        }
    };

    const reloadConversation = async (conversationId) => {
        try {
            await api.get(`/api/message/${conversationId}`)
            .then(res => {
                setResponse(res.data);
            })
        }
        catch(err) {
            console.log(err.response)
        }
    }

    const getMessages = async (conversationId) => {
        setConversationId(conversationId);
        if(contactList) {
            setConversation(contactList.filter(contact => contact.conversationId == conversationId));
        }

        if(firstClick) {
            setFirstClick(false);
        }
        
        try {
            await api.get(`/api/message/${conversationId}`)
            .then(res => {
                setResponse(res.data);
            })
        }
        catch(err) {
            console.error(err.response)
        }
    }

    const getOnlineUsers = async () => {
        let onlineUsers = []
        try {
            await api.get('/api/users/online')
            .then(res => {
                onlineUsers = res.data.onlineUsers;
            })
        }
        catch(err) {
            console.log(err)
        }

        return onlineUsers;
    }

    const getOnlineContacts = async (userContacts) => {
        try {
            const onlineUsers = await getOnlineUsers();
            let newContacts = [];

            for(let i = 0; i < userContacts.length; i++) {
                const conversationId = userContacts[i].conversationId;
                const participants = userContacts[i].participants;

                const contact = participants.filter(participant => participant.name == userContacts[i].contactName)
                const contactId = contact[0].id;
                const findId = onlineUsers.filter(users => users.userId == contactId);
                let status = '';

                if(findId.length) {
                    status = 'online';
                }
                else {
                    status = 'offline';
                }

                const updateContact = {
                    name: contact[0].name,
                    id: contact[0].id,
                    conversationId: conversationId,
                    status: status
                }
                newContacts.push(updateContact);
            }
            setUserContacts(newContacts);
        }
        catch (error){
            console.error(error)
        }
    }

    

    useEffect(() => {
        getContacts();
    }, [])


    useEffect(() => {
        const loginStatus = sessionStorage.getItem('auth-token');

        if(!loginStatus) {
            setIsLoading(true);
            setLoadingMessage('Unauthorized. Redirecting to homepage...');
            setTimeout(() => {
                navigateTo('/');
            }, 2000)
        }
    }, [navigateTo])
      
    useEffect(() => {
        getOnlineUsers();
        getContacts();
        getOnlineContacts(contactList);
        getMessages(conversationId);

        const interval = setInterval(() => {
            getOnlineUsers();
            getContacts();
            getMessages(conversationId);
        }, 5000)

        return () => {
            clearInterval(interval);
        }
    }, [conversationId, contactList])

    useEffect(() => {
        const currentConversationId = conversationId;
        const currentContacts = contactList;
      
        const interval = setInterval(() => {
            getOnlineUsers();
            getContacts();
            getOnlineContacts(currentContacts);
            getMessages(currentConversationId);
        }, 5000);
      
        return () => {
          clearInterval(interval);
        };
    }, [conversationId, contactList]);

    
    
    return (
        <section className='messages-page'>
            {
                isLoading && <Loading message={loadingMessage}/>
            }
            <Contacts contactList={contactList} getConversation={getMessages} userContacts={userContacts}/>
            <Conversation convId={conversationId} contactInfo={conversation} response={response} reload={reloadConversation}/>
        </section>
    )
}

export default Messages