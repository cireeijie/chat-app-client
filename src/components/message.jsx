import '../assets/css/message.css'

const Message = ({sender, message, isCurrentUser, id}) => {
    return (
        <div key={id} id={id} className={isCurrentUser ? 'right' : 'left'} >
            <div className="sender">
                <p>{sender}</p>
            </div>
            <div className="message">
                <p>{message}</p>
            </div>
        </div>
    )
}

export default Message