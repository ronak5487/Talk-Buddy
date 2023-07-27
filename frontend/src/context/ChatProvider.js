import React, { createContext, useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
 const ChatContext=createContext();
const ChatProvider = ({children}) => {
   const [user,setUser]=useState();
   const [selectedChat,setSelectedChat]=useState();
   const [chats,setChats]=useState();
   const [notification,setNotification]=useState([])
   const navigate=useNavigate();
   useEffect(()=>{
    
    const userInfo = window.localStorage.getItem("userInfo");
    if (userInfo) {
      try {
        setUser(JSON.parse(userInfo));
      } catch (error) {
        console.error("Error parsing user info from localStorage:", error);
      }
    } else {
      navigate("/");
    }
   },[navigate])
  return (
    <ChatContext.Provider
    value={{
        user,
        setUser,
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
        notification,
        setNotification
    }}>
     {children}
    </ChatContext.Provider>
  )
}
export const ChatState =()=>{
    return useContext(ChatContext);
}

export default ChatProvider