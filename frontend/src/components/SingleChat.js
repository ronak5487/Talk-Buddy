import { ArrowBackIcon } from '@chakra-ui/icons'
import { Box, FormControl, IconButton, Input, Spinner, Text, useToast } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider'
import ProfileModal from './miscelleneus/ProfileModal'
import { getSenderFull, getsender } from '../config/chatlogic'
import UpdateGroupChatModal from './miscelleneus/UpdateGroupChatModal'
import axios from 'axios'
import "./styles.css"
import ScrollableChat from './ScrollableChat'
import io from "socket.io-client"
import Lottie from "react-lottie"
import animationData from "../animations/Typing.json"

var socket, selectedChatCompare;
const SingleChat = ({fetchAgain,setFetchAgain}) => {
    const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [socketConnected, setSocketConnected] = useState(false);
  const [typing, setTyping] = useState();
  const [istyping, setIsTyping] = useState();
  const toast = useToast();
  const { selectedChat, setSelectedChat, user, notification, setNotification } =
    ChatState();
    const ENDPOINT="https://talk-buddy.onrender.com/"

    useEffect(()=>{
     socket =io(ENDPOINT);
     socket.emit("setup",user);
     socket.on("connected",()=>setSocketConnected(true));
     socket.on("typing",(room)=>setIsTyping(room));
     socket.on("stop typing",()=>setIsTyping());
    },[])

  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };
const sendMessage=async(event)=>{
    if(event.key==="Enter" && newMessage){
      socket.emit("stop typing",selectedChat._id)
        try{
            const config={
                headers:{
                    "conten-type":"application/json",
                  Authorization: `Bearer ${user.token}`
                }
               }
               setNewMessage("");
               const {data}= await axios.post(`https://talk-buddy.onrender.com/api/messages/sendmessage`,{content:newMessage,chatId:selectedChat._id},config);
               console.log(data);
               socket.emit("new message",data);
              setMessages([...messages,data])
        }
        catch(err){
            console.log(err)
            toast({
             title:"Error Occured",
             status: 'error',
             duration: 5000,
             isClosable: true,
             position:"top",
           });
        }
    }

}
const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      setLoading(true);

      const { data } = await axios.get(
        `https://talk-buddy.onrender.com/api/messages/${selectedChat._id}`,
        config
      );
      setMessages(data);
      setLoading(false);
socket.emit("join chat", selectedChat._id);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Occured!",
        description: "Failed to Load the Messages",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

const typingHandler=async(e)=>{
  
    setNewMessage(e.target.value);
    if(!socketConnected)return;
    if(!typing){
      setTyping(true);
      socket.emit("typing",selectedChat._id);

    }
    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      if (timeDiff >= timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);

}
  useEffect(()=>{
    fetchMessages();
    selectedChatCompare=selectedChat;
    if(selectedChatCompare)setNotification(notification.filter((n)=>n.chat._id!=selectedChatCompare._id));
  },[selectedChat])

  useEffect(()=>{
    socket.on("message recieved",(newmessage)=>{
      if(!selectedChatCompare || selectedChatCompare._id!=newmessage.chat._id){
          if(!notification.includes(newmessage)){setNotification([newmessage,...notification])
          setFetchAgain(!fetchAgain)}
          
      }
    else {

      setMessages([...messages,newmessage])}
    })
  })

  return (
    <>
    {selectedChat ? (
      <>
        <Text
          fontSize={{ base: "28px", md: "30px" }}
          pb={3}
          px={2}
          w="100%"
          fontFamily="Work sans"
          display="flex"
          justifyContent={{ base: "space-between" }}
          alignItems="center"
        >
          <IconButton
            d={{ base: "flex", md: "none" }}
            icon={<ArrowBackIcon />}
            onClick={() => setSelectedChat("")}
          />
          {messages &&
            (!selectedChat.isgroupchat ? (
              <>
                {getsender(user, selectedChat.users)}
                <ProfileModal
                  user={getSenderFull(user, selectedChat.users)}
                />
              </>
            ) : (
              <>
                {selectedChat.chatname.toUpperCase()}
                <UpdateGroupChatModal
                  fetchMessages={fetchMessages}
                  fetchAgain={fetchAgain}
                  setFetchAgain={setFetchAgain}
                />
              </>
            ))}
        </Text>
        <Box
          display="flex"
          flexDir="column"
          justifyContent="flex-end"
          p={3}
          bg="#E8E8E8"
          w="100%"
          h="100%"
          borderRadius="lg"
          overflowY="hidden"
        >
          {loading ? (
            <Spinner
              size="xl"
              w={20}
              h={20}
              alignSelf="center"
              margin="auto"
            />
          ) : (
            <div className="messages">
              <ScrollableChat messages={messages} />
            </div>
          )}

          <FormControl
            onKeyDown={sendMessage}
            id="first-name"
            isRequired
            mt={3}
          >
            {istyping==selectedChat._id  ? (
              <div>
                <Lottie
                  options={defaultOptions}
                  // height={50}
                  width={70}
                  style={{ marginBottom: 15, marginLeft: 0 }}
                />
              </div>
            ) : (
              <></>
            )}
            <Input
              variant="filled"
              bg="#E0E0E0"
              placeholder="Enter a message.."
              value={newMessage}
              onChange={typingHandler}
            />
          </FormControl>
        </Box>
      </>
    ) : (
      // to get socket.io on same page
      <Box display="flex" alignItems="center" justifyContent="center" h="100%">
        <Text fontSize="3xl" pb={3} fontFamily="Work sans">
          Click on a user to start chatting
        </Text>
      </Box>
    )}
  </>
  )
}

export default SingleChat