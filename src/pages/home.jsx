import { useEffect, useState } from "react"
import Modal from "../components/modal"
import Loading from "../components/loading"
import { useNavigate } from "react-router-dom"
import '../assets/css/home.css'

const Home = () => {
    const [ openModal, setOpenModal ] = useState(false);
    const [ form, setForm ] = useState();
    const navigateTo = useNavigate();

    const forms = [
        {
            id: 'login',
            subtitle: 'Chat your way to a brighter day!',
            loadingMessage: {
                error: 'Something is wrong',
                success: 'Redirecting to messages...'
            },
            inputs: [
                {
                    id: 'userEmail',
                    type: 'text',
                    placeholder: 'Email address'
                },
                {
                    id: 'userPassword',
                    type: 'password',
                    placeholder: 'Password'
                }
            ]
        },
        {
            id: 'register',
            subtitle: 'Connect, Communicate, and Collaborate with KaTalk',
            loadingMessage: {
                error: 'Something is wrong',
                success: 'Redirecting to login...'
            },
            inputs: [
                {
                    id: 'userName',
                    type: 'text',
                    placeholder: 'Username'
                    
                },
                {
                    id: 'userEmail',
                    type: 'text',
                    placeholder: 'Email address'
                },
                {
                    id: 'userPassword',
                    type: 'password',
                    placeholder: 'Password'
                }
            ]
        }
    ]

    const handleModal = (e) => {
        const getFormID = e.target.id;
        const getForm = forms.filter(form => form.id == getFormID);
        setForm(getForm[0]);
        setOpenModal(true);
    }

    useEffect(() => {
        const loginStatus = sessionStorage.getItem('auth-token');

        if(loginStatus) {
            setTimeout(() => {
                navigateTo('/messages');
            }, 2000);
        }
        else {
            navigateTo('/');
        }
    }, [navigateTo])

    return (
        <section className="home-section">
            <div className="title">
                <h1>KaTalk</h1>
                <p>Connecting People, One Chat at a Time</p>
            </div>
            <div className="home-container container">
                <div className="action-btns">
                    <button id="login" className="login-btn" onClick={handleModal}>Login</button>
                    <button id="register" className="login-btn" onClick={handleModal}>Create new account</button>
                </div>
            </div>
            
            <Modal
                openTrigger={openModal} 
                closeTrigger={() => setOpenModal(false)}
                modalData={form}
                type='form'
            />
        </section>
    )
}

export default Home