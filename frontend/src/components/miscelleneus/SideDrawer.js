import { Button } from "@chakra-ui/button";
import { useDisclosure } from "@chakra-ui/hooks";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
import {
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
} from "@chakra-ui/menu";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from "@chakra-ui/modal";
import { Tooltip } from "@chakra-ui/tooltip";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import { Avatar } from "@chakra-ui/avatar";
import { useHistory, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { useToast } from "@chakra-ui/toast";
import ChatLoading from "./ChatLoading";
import { Spinner } from "@chakra-ui/spinner";
import ProfileModal from "./ProfileModal";
// import NotificationBadge from "react-notification-badge";
import NotificationBadge, { Effect } from "react-notification-badge"
// import { Effect } from "react-notification-badge";
// import { getSender } from "../../config/ChatLogics";
import UserListItem from "../UserAvatar/UserListItem"
import { ChatState } from "../../context/ChatProvider";
import { getsender } from "../../config/chatlogic";

const SideDrawer = () => {
  const navigate=useNavigate();
    const [search,setSearch]=useState("");
    const [searchResult,setSearchResult]=useState([]);
    const [loading,setLoading]=useState(false);
    const [chatloading,setChatloading]=useState(false);
    const {user,chats,setChats,selectedChat,setSelectedChat,notification,setNotification}=ChatState();
    const {isOpen,onOpen,onClose}=useDisclosure();
    const toast=useToast();

    const logoutHandler=()=>{
      localStorage.removeItem("userInfo");
      navigate("/");
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
          console.log(err);
    }
  }
    const accessChat=async(userId)=>{
    try{
      setChatloading(true);
       if(!userId){
        toast({
          title:"something went wrong",
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:"top",
        });
        setChatloading(false)
        return;
       }
       const config={
        headers:{
          Authorization:`Bearer ${user.token}`,
          "content-type":"application/json"
        }
       }
       const {data}=await axios.post("https://talk-buddy.onrender.com/api/chats/accesschat",{userId},config);
       if(!chats.find((c)=>c._id===data._id))setChats([data,...chats]);
       console.log(data);
       setChatloading(false)
       setSelectedChat(data);
       onClose();

       return;
    }
    catch(err){
      console.log(err);
      setChatloading(false)
      toast({
        title:"Failed to fetch chat",
        status: 'error',
        duration: 5000,
        isClosable: true,
        position:"top",
      })

    }
    }

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="Search Users to chat" hasArrow placement="bottom-end">
          <Button variant="ghost" onClick={onOpen} >
            <i className="fas fa-search"></i>
            <Text d={{ base: "none", md: "flex" }} px={4}>
              Search User
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize="2xl" fontFamily="Work sans">
          Talk-A-Tive
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              <NotificationBadge
                count={notification.length}
                effect={Effect.SCALE}
              />
              <BellIcon fontSize="2xl" m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    setNotification(notification.filter((n) => n !== notif));
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getsender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>
          <Menu>
            <MenuButton as={Button} bg="white" rightIcon={<ChevronDownIcon />}>
              <Avatar
                size="sm"
                cursor="pointer"
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>
                <MenuItem>My Profile</MenuItem>{" "}
              </ProfileModal>
              <MenuDivider />
              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth="1px">Search Users</DrawerHeader>
          <DrawerBody>
            <Box display="flex" pb={2}>
              <Input
                placeholder="Search by name or email"
                mr={2}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Button onClick={handleSearch}>Go</Button>
            </Box>
            {loading ? (
              <ChatLoading />
                ) : (
                searchResult?.map((user) => (
                    <UserListItem
                    key={user._id}
                    user={user}
                    handleFunction={() => accessChat(user._id)}
                    />
                ))
                )}
            {chatloading && <Spinner ml="auto" d="flex" />}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
}
  

export default SideDrawer