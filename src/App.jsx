import './App.css'
import { BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from './pages/home'
import Messages from './pages/messages'
import api from './api/user'

function App() {
    api.defaults.headers.common['auth-token'] = sessionStorage.getItem('auth-token') ? sessionStorage.getItem('auth-token'): null;
    return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path='/' element={<Home />}/>
          <Route exact path='/messages' element={<Messages />}/>
        </Routes>
      </BrowserRouter>
    </>
)
}

export default App
