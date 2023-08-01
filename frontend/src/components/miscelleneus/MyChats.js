import { AddIcon } from '@chakra-ui/icons';
import { Box, Button, Stack, Text, useToast } from '@chakra-ui/react'
import React, { useContext, useEffect, useState } from 'react'
import ChatLoading from './ChatLoading';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ChatState } from '../../context/ChatProvider';
import { getsender } from '../../config/chatlogic';
import GroupChatModal from './GroupChatModal';

const MyChats = ({fetchAgain,setFetchAgain}) => {
  const [loggedUser,setLoggedUser]=useState();
  const {user,selectedChat,setSelectedChat,chats,setChats}=ChatState();
  const navigate=useNavigate();
  const toast=useToast();
  const fetchchats=async()=>{
    try{
       if(!user){
        navigate("/")
        return;
       }
       else {
        const config={
          headers:{
            Authorization:`Bearer ${user.token}`
          }
        }
        const {data}=await axios.get("https://talk-buddy.onrender.com/api/chats/fetchchat",config);
        console.log(data);
        setChats(data);
       }
    }
    catch(err){
      toast({
        title:"Failed to fetch chat",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position:"top",
      })
    }
  }
  useEffect(()=>{
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")))
    fetchchats();
  },[fetchAgain])
  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work sans"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChatModal>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChatModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                key={chat._id}
              >
                <Text>
                  {!chat.isgroupchat
                    ? getsender(user, chat.users)
                    : chat.chatname}
                </Text>
                {chat.latestMessage && (
                  <Text fontSize="xs">
                    <b>{chat.latestMessage.sender.name} : </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  )
}

export default MyChats