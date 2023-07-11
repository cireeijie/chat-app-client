import '../assets/css/loading.css'

const Loading = ({message}) => {
    return (
        <div className="loading-section">
            <div className="loading-container">
                <div className="loading-object">
                    <div className="dot dot1"></div>
                    <div className="dot dot2"></div>
                    <div className="dot dot3"></div>
                </div>
                <div className='loading-message'>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    )
}

export default Loading