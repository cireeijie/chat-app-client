import { useEffect, useRef, useState } from 'react';
import api from '../api/user'
import '../assets/css/conversation.css'
import Message from './message';

const Conversation = ({contactInfo, response, reload}) => {
    const [ message, setMessage ] = useState();
    const [ data, setData ] = useState([]);
    const [ contact, setContact ] = useState();
    const [ messages, setMessages ] = useState();
    const containerRef = useRef(null);

    useEffect(() => {
        setData(response);
        setContact(contactInfo[0]);
        setMessages(response.messages);

        
    }, [response, contactInfo])

    useEffect(() => {
        if(containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    },[response])

    const handleMessageSend = async () => {
        const messageContainer = document.querySelector('.compose');
        const newMessage = {
            conversationId: contact.conversationId,
            participants: contact.participants,
            message: message
        };

        try {
            await api.post(`/api/message/send`, newMessage)
            .then(res => {
                setMessage('');
                messageContainer.value = '';
                
            })
            .catch(err => {
                console.log(err.data)
            })
        }
        catch(err) {
            console.error(err.response);
        }
        
        reload(contact.conversationId);

        containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }

    return (
        <div className='conversation-container'>
            <div className='conversation'>
                <div className='conversation-header'>
                    <p>{contact ? contact.contactName : 'Start chatting with your contacts'}</p>
                </div>
                <div ref={containerRef} className='conversation-body'>
                    {
                        data.status == 'failed' ? 
                            data.message 
                        : 
                        (messages && messages.map(message => {
                            return <Message key={message._id} id={message._id} sender={message.sender[0].name} message={message.content} isCurrentUser={message.isCurrentUser}/>
                        }))
                    }
                </div>
                <div className='compose-message'>
                    <textarea 
                        className='compose' 
                        id='message' 
                        onInput={(e) => {
                            const textArea = e.target;

                            setMessage(textArea.value);
                            textArea.style.height = `auto`;
                            textArea.style.height = `${textArea.scrollHeight}px`;
                        }}>
                    </textarea>
                    <button id='sendBtn' onClick={handleMessageSend}>Send</button>
                </div>
            </div>
            
        </div>
    )
}

export default Conversation