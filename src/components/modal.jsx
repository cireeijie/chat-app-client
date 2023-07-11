import { useEffect, useRef, useState } from "react";
import api from '../api/user';
import '../assets/css/modal.css';
import { useNavigate } from 'react-router-dom';
import Loading from "./loading";

const Modal = ({openTrigger, closeTrigger, modalData, type, accept}) => {
    const [ message, setMessage ] = useState();
    const [ status, setStatus ] = useState();
    const [ loginSuccessful, setLoginSuccessful ] = useState(false);
    const [ registerSuccessful, setRegisterSuccessful ] = useState(false);
    const [ isLoading, setIsLoading ] = useState(false);
    const getForm = useRef();
    const data = {}
    const navigateTo = useNavigate();

    const getFormData = async (e) => {
        e.preventDefault();
        
        const formInputLength = modalData.inputs.length;
        for(let i = 0; i < formInputLength; i++) {
            data[getForm.current[i].name] = getForm.current[i].value;
        }

        await api.post(`/api/user/${modalData.id}`, data)
        .then(response => {
            const message = response.data.message;
            const token = response.data.token;
            const status = response.data.status;
            const userID = response.data.userId;

            if(status == 'success') {
                setStatus(status);
                setMessage(message);

                if(modalData.id == 'login') {
                    sessionStorage.setItem('auth-token', token);
                    api.defaults.headers.common['auth-token'] = token;
                    setLoginSuccessful(true);
                    setIsLoading(true);
                }
                if(modalData.id == 'register') {
                    setRegisterSuccessful(true);
                    setIsLoading(true);
                }
            }
        })
        .catch(err => {
            const error = err.response.data;
            const identifyError = err.response.data.hasOwnProperty('key');

            if(identifyError) {
                setStatus(error.status);
                setMessage(error.message.replace(`"${error.key}"`, `${error.key.replace('user', '')}`));
            }
            else {
                setStatus(error.status);
                setMessage(error.message);
            }
            
        })
    }

    useEffect(() => {
        if(loginSuccessful) {
            setTimeout(() => {
                navigateTo('/messages');
            }, 2000);
        }
        if(registerSuccessful) {
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }, [loginSuccessful, registerSuccessful])

    if(!openTrigger) return null;

    if(type == 'prompt') return (
        <section className="modal-section">
            <div className="close-area" onClick={closeTrigger}></div>
            <div className="modal-container container">
                <div className="modal-header">
                    <h1>{modalData.title}</h1>
                </div>
                <div className="modal-body">
                    <p>{modalData.subtitle}</p>
                    <div className="modal-action-btns">
                        <button onClick={accept} className="accept-btn warning">Yes</button>
                        <button onClick={closeTrigger}className="decline-btn" >No</button>
                    </div>
                </div>
                <div className="modal-footer">
                </div>
            </div>
        </section>
    )
        
    if(type == 'form') return (
        <section className="modal-section">
            {
                isLoading ? 
                    <Loading message={status == 'success' ? modalData.loadingMessage.success : modalData.loadingMessage.error}/>
                :
                    ''
            }
            <div className="close-area" onClick={closeTrigger}></div>
            <div className="modal-container container">
                <h1>{modalData.id}</h1>
                <p>{modalData.subtitle}</p>
                <form id={modalData.id + 'Form'} ref={getForm} onSubmit={getFormData}>
                {
                    modalData.inputs.map(input => {
                        return <input key={input.id} type={input.type} id={input.id} name={input.id} placeholder={input.placeholder} required/>
                    })
                }
                <p className={
                    `message ${!status ? '' : status == 'failed' ? 'error' : 'success'}`
                    }
                >
                    {
                        !status ? '' : status == 'failed' ? (<i className="fa-solid fa-xmark"></i>) : (<i className="fa-solid fa-check"></i>)
                    }
                    {message}
                </p>
                <button className="submit-btn">Submit</button>
                </form>
            </div>
        </section>
    )
}

export default Modal