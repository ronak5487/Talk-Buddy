import logo from './logo.svg';
import './App.css';
import Homepage from './pages/Homepage';
import ChatPage from './pages/ChatPage';
import { Route,Routes } from 'react-router-dom';

function App() {
  
  return (
    <div className='App'>
    <Routes>
      <Route path="/" element={<Homepage/>} exact/>
      <Route path="/chats" element={<ChatPage/>}/>
    </Routes>
    </div>
  );
}

export default App;
