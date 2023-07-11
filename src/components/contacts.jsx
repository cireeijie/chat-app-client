import { useEffect, useState } from 'react'
import api from '../api/user'
import '../assets/css/contacts.css'
import { useNavigate } from 'react-router-dom';
import Loading from './loading';
import Modal from './modal';

const Contacts = ({getConversation, userContacts}) => {
    const [ search, setSearch ] = useState();
    const [ result, setResult ] = useState([]);
    const [ message, setMessage ] = useState();
    const [ isLoggedOut, setIsLoggedOut ] = useState(false);
    const [ loadingMessage, setLoadingMessage ] = useState();
    const [ openPopUp, setOpenPopUp ] = useState(false);
    const [ modalData, setModalData ] = useState();
    const navigateTo = useNavigate();

    const handleLogout = async () => {
        setIsLoggedOut(true);

        await api.post('/api/user/logout')
        .then(response => {
            if(response.data.status == 'success') {
                sessionStorage.removeItem('auth-token');
                api.defaults.headers.common['auth-token'] = '';
                setLoadingMessage('You are logged out! Redirecting to homepage...');
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    const logoutPrompt = () => {
        setOpenPopUp(true)

        const data = {
            title: 'Are you sure you want to logout?',
            subtitle: 'Logging out will end your current session'
        };

        setModalData(data);
    }

    const newConversation = async (e) => {
        const contactId = e.target.id;

        const newContact = {
            participants: [
                contactId
            ]
        }
        
        try {
            await api.post('/api/conversation', newContact)
            .then(res => {
                console.log(res.data);
            })
        } catch(err) {
            console.log(err)
        }
    }

    const handleSearchBar = (e) => {
        setSearch(e.target.value);
    }

    const handleResultFocus = (e) => {
        const searchResult = document.querySelector('#searchResult');
        
        if(e.type === 'focus') {
            searchResult.classList.add('show-result');
        } else {
            setTimeout(() => {
                setResult([])
                searchResult.classList.remove('show-result');
            }, 100);
        }
    }

    useEffect(() => {
        if(isLoggedOut) {
            setTimeout(() => {
                navigateTo('/');
            }, 2000)
        }
    }, [navigateTo, isLoggedOut])

    useEffect(() => {
        const searchUser = {
            name: search
        }
        
        try {
            api.post('/api/search', searchUser)
            .then(res => {
                if(res.data.status == 'success') {
                    setResult(res.data.users);
                }
                else {
                    setMessage(res.data.message);
                }
            })
        } catch(err) {
            console.log(err);
        }
    }, [search])

    return (
        <div className="contact-section">
            <Modal openTrigger={openPopUp} closeTrigger={() => setOpenPopUp(false)} type='prompt' modalData={modalData} accept={handleLogout}/>
            {
                isLoggedOut && <Loading message={loadingMessage}/>
            }
            <div className="contact-container">
                <div className="search-bar-container">

                    <div className='search-bar'>
                        <i className="fa-solid fa-magnifying-glass"></i>
                        <input type="text" name="search" id="search" placeholder="Search contact" onFocus={handleResultFocus} onChange={handleSearchBar} onBlur={handleResultFocus}/>
                    </div>
                    <div className='search-result' id='searchResult'>
                    {
                        result ? 
                        result.map(result => {
                            return (
                                <div className='search-contact' key={result._id} id={result._id} onClick={newConversation}>
                                    <i className="fa-solid fa-circle-user"></i>
                                    <p className='name'>{result.name}</p>
                                </div>
                            )
                        })
                        : 
                        <p>{message}</p>
                    }
                    </div>
                </div>
                <div className='contact-lists'>
                    <p className='contacts-title'>Contact List <span className='title-line'></span></p>
                    {
                        userContacts ? 
                        userContacts.map(contact => {
                            return (
                                <div key={contact.conversationId} id={contact.conversationId} className='contact' onClick={(e) => getConversation(e.target.id)}>
                                    <i className="fa-solid fa-circle-user"></i>
                                    <p className='name'>{contact.name}</p>
                                    <div className={`user-status ${contact.status}`}>
                                        <i className={contact.status == 'online' ? `fa-solid fa-circle` : `fa-regular fa-circle`}></i>
                                        <p>{contact.status}</p>
                                    </div>
                                    
                                </div>
                            )
                        })
                        :
                        <p>No Contacts</p>
                    }
                </div>
                <div className='user-action-btns'>
                    <div className='logout-btn' onClick={logoutPrompt}>
                        <i className="fa-solid fa-right-from-bracket"></i>
                    </div>
                    <div>
                        <i className="fa-solid fa-gear"></i>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Contacts