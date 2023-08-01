import { ViewIcon } from '@chakra-ui/icons'
import { Box, Button, FormControl, IconButton, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import { ChatState } from '../../context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';
import UserListItem from '../UserAvatar/UserListItem';
import axios from 'axios';

const UpdateGroupChatModal = ({fetchAgain,setFetchAgain,fetchMessages}) => {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { selectedChat, setSelectedChat, user } = ChatState();
  const [groupChatName, setGroupChatName] = useState(selectedChat.chatname);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameloading, setRenameLoading] = useState(false);
  const toast = useToast();

  const handleRename=async()=>{
    setRenameLoading(true)
   if(!groupChatName){
    setRenameLoading(false)
    toast({
        title:"Please give name to group",
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:"top",
      });
      return;
   }
   try{
   const config={
    headers:{
        "content-type":'application/json',
        Authorization:`Bearer ${user.token}`
    }
   }
   const chatId=selectedChat._id;
   const chatname=groupChatName
   const {data}=await axios.put("https://talk-buddy.onrender.com/api/chats/rename",{chatId,chatname},config);
   console.log(data);
   setSelectedChat(data);
   setFetchAgain(!fetchAgain);
   setRenameLoading(false);
   onClose();
   toast({
    title:"Group renamed!",
    status: 'success',
    duration: 5000,
    isClosable: true,
    position:"top",
  });
}
catch(err){
    setRenameLoading(false);
    toast({
     title:"Error Occured",
     status: 'error',
     duration: 5000,
     isClosable: true,
     position:"top",
   });
}
setGroupChatName("");
  }
  const handleSearch=async ()=>{
    setLoading(true);
    try {
     const config={
     headers:{
       Authorization: `Bearer ${user.token}`
     }
    }
    const {data}= await axios.get(`https://talk-buddy.onrender.com/api/users?search=${search}`,config);
    console.log(data);
    setLoading(false)
    setSearchResult(data);
    }
    catch(err){
        toast({
         title:"Error Occured",
         status: 'error',
         duration: 5000,
         isClosable: true,
         position:"top",
       });
    }
}
const handleAddUser=async(user1)=>{
   try{
    if(selectedChat.users.find((u)=>u._id==user1._id)){
        toast({
            title:"User already in group",
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position:"top",
        })
       return;
    }
    if(selectedChat.groupadmin._id!=user._id){
        toast({
            title:"Only group admin can add members",
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position:"top",
        })
       return;
    }
    setLoading(true);


    const config={
        headers:{
            "conten-type":"application/json",
          Authorization: `Bearer ${user.token}`
        }
       }
       const {data}= await axios.put(`https://talk-buddy.onrender.com/api/chats/addtogrp`,{userId:user1._id,chatid:selectedChat._id},config);
       console.log(data);
       setSelectedChat(data);
       setFetchAgain(!fetchAgain);
       setLoading(false)
}
   catch(err){
    console.log(err)
    setLoading(false)
    toast({
     title:"Error Occured",
     status: 'error',
     duration: 5000,
     isClosable: true,
     position:"top",
   });
}
}

const handleRemove=async(user1)=>{
    try{
        if(selectedChat.groupadmin._id!=user._id && user1._id!==user._id){
            toast({
                title:"Only group admin can remove someone",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"top",
            })
           return;
        }
        setLoading(true);


        const config={
            headers:{
                "conten-type":"application/json",
              Authorization: `Bearer ${user.token}`
            }
           }
           const {data}= await axios.put(`https://talk-buddy.onrender.com/api/chats/removefromgrp`,{userId:user1._id,chatId:selectedChat._id},config);
           console.log(data);
           user._id===user1._id?setSelectedChat():setSelectedChat(data);
           setFetchAgain(!fetchAgain);
           fetchMessages();
           setLoading(false)

    }
    catch(err){
        console.log(err)
    setLoading(false)
    toast({
     title:"Error Occured",
     status: 'error',
     duration: 5000,
     isClosable: true,
     position:"top",
   });

    }
}
  return (
    <>
    <IconButton d={{ base: "flex" }} icon={<ViewIcon />} onClick={onOpen} />

    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          fontSize="35px"
          fontFamily="Work sans"
          d="flex"
          justifyContent="center"
        >
          {selectedChat.chatName}
        </ModalHeader>

        <ModalCloseButton />
        <ModalBody d="flex" flexDir="column" alignItems="center">
          <Box w="100%" d="flex" flexWrap="wrap" pb={3}>
            {selectedChat.users.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                admin={selectedChat.groupAdmin}
                handleFunction={() => handleRemove(u)}
              />
            ))}
          </Box>
          <FormControl d="flex">
            <Input
              placeholder="Chat Name"
              mb={3}
              value={groupChatName}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
            <Button
              variant="solid"
              colorScheme="teal"
              ml={1}
              isLoading={renameloading}
              onClick={handleRename}
            >
              Update
            </Button>
          </FormControl>
          <FormControl>
            <Input
              placeholder="Add User to group"
              mb={1}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </FormControl>

          {loading ? (
            <Spinner size="lg" />
          ) : (
            searchResult?.map((user) => (
              <UserListItem
                key={user._id}
                user={user}
                handleFunction={() => handleAddUser(user)}
              />
            ))
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={() => handleRemove(user)} colorScheme="red">
            Leave Group
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  )
}

export default UpdateGroupChatModal