import { Box, Button, FormControl, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, useDisclosure, useToast } from '@chakra-ui/react'
import React, { useState } from 'react'
import UserListItem from '../UserAvatar/UserListItem';
import axios from 'axios';
import { ChatState } from '../../context/ChatProvider';
import UserBadgeItem from '../UserAvatar/UserBadgeItem';

const GroupChatModal = ({children}) => {
    const {onOpen,onClose,isOpen}=useDisclosure(0);
    const [groupChatName,setGroupChatName]=useState("");
    const [selectedUsers,setSelectedUsers]=useState([]);
    const [searchResult,setSearchResult]=useState();
    const [loading,setLoading]=useState(false);
    const {user,chats,setChats}=ChatState();
    const toast=useToast();

    const handleSearch=async(query)=>{
     try{
        setLoading(true);
        const config={
            headers:{
                Authorization:`Bearer ${user.token}`
            }
        }
        const {data}=await axios.get(`https://talk-buddy.onrender.com/api/users?search=${query}`,config);
        console.log(data);
        setLoading(false);
        setSearchResult(data);
     }
     catch(err){
         setLoading(false);
        toast({
            title:"Error Occured",
            status: 'warning',
            duration: 5000,
            isClosable: true,
            position:"top",
        })
     }
    }
    const handleDelete=(usertodelete)=>{
        setSelectedUsers(selectedUsers.filter((u)=>u._id!=usertodelete._id));
        return;
    }
    const handleGroup=(user)=>{
        if(selectedUsers.includes(user)){
            toast({
                title:"User already in group",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"top",
            })
            return;
        }
        setSelectedUsers([...selectedUsers,user]);
    }
    const handleSubmit=async()=>{
        try{
        if(!selectedUsers || !groupChatName){
            toast({
                title:"Please fill all the fields",
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position:"top",
            })
            
            return;
        }
       

        const config={
            headers:{
                "content-type":"application/json",
                Authorization:`Bearer ${user.token}`
            }
        }
        const {data}=await axios.post("https://talk-buddy.onrender.com/api/chats/creategroup",{name:groupChatName,
        users:selectedUsers.map((u)=>u._id)},
        config);
        console.log(data);
        setGroupChatName("");
        setSelectedUsers([]);
        setSearchResult()
        setChats([data,...chats]);
        onClose();
        toast({
            title:"Group created successfully",
            status: 'success',
            duration: 5000,
            isClosable: true,
            position:"top",
        })
    }
    catch(err){
        toast({
            title:"Error Occured",
            status: 'error',
            duration: 5000,
            isClosable: true,
            position:"top",
        })
        return;
    }
    }
  return (
    <>
    <span onClick={onOpen}>{children}</span>

    <Modal onClose={onClose} isOpen={isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader
          fontSize="35px"
          fontFamily="Work sans"
          d="flex"
          justifyContent="center"
        >
          Create Group Chat
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody d="flex" flexDir="column" alignItems="center">
          <FormControl>
            <Input
              placeholder="Chat Name"
              mb={3}
              onChange={(e) => setGroupChatName(e.target.value)}
            />
          </FormControl>
          <FormControl>
            <Input
              placeholder="Add Users eg: John, Piyush, Jane"
              mb={1}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </FormControl>
          <Box w="100%" d="flex" flexWrap="wrap">
            {selectedUsers.map((u) => (
              <UserBadgeItem
                key={u._id}
                user={u}
                handleFunction={() => handleDelete(u)}
              />
            ))}
          </Box>
          {loading ? (
            // <ChatLoading />
            <div>Loading...</div>
          ) : (
            searchResult
              ?.slice(0, 4)
              .map((user) => (
                <UserListItem
                  key={user._id}
                  user={user}
                  handleFunction={() => handleGroup(user)}
                />
              ))
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={handleSubmit} colorScheme="blue">
            Create Chat
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  </>
  )
}

export default GroupChatModal