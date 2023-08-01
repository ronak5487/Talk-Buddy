import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack } from '@chakra-ui/react'
import React, { useState } from 'react'
import { useToast } from '@chakra-ui/react'
import {useNavigate} from"react-router-dom"
import axios from "axios";

const Signup = () => {
  const [name,setName]=useState("");
  const [show,setShow]=useState(false);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [confirmpassword,setConfirmpassword]=useState("");
  const toast = useToast();
  const [loading,setLoading]=useState(false);
  const [pic,setPic]=useState();
  const navigate=useNavigate();

  const handleClick=()=>{
    setShow(!show);
  }
  const postDetails=(pics)=>{
    setLoading(true);
    if(!pics){
      toast({
        title: 'Please Select an Image!',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:"top",
      })
      setLoading(false);
      return;
    }
    if(pics.type==='image/jpeg' || pics.type==='image/png'){
      const data = new FormData();
      data.append("file",pics);
      data.append("upload_preset","chat-app");
      data.append("cloud_name","dtk3lqyah");
      fetch("https://api.cloudinary.com/v1_1/dtk3lqyah/image/upload",{
        method:"post",
        body:data,
      }).then((res)=>res.json())
      .then((data)=>{
        console.log(data);
        toast({
          title: 'Image uploaded successfully!',
          status: 'success',
          duration: 5000,
          isClosable: true,
          position:"top",
        });
        console.log(data.url.toString());
        setPic(data.url.toString());
        setLoading(false);
      })
      .catch((err)=>{
        console.log(err);
        setLoading(false);
      })

    }
    else{
      toast({
        title: 'Please upload only jpeg/png images',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:"top",
      })
      setLoading(false);
      return;
    }
  };
  const submitHandler=async ()=>{
    setLoading(true);
    if(!name || !email || !password || !confirmpassword){
      toast({
        title: 'Please Fill all the fields',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:"top",
      })
      setLoading(false);
      return;
    }
    if(password!=confirmpassword){
      toast({
        title: 'password is not matching',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:"top",
      })
      setLoading(false);
      return;
    }
    console.log(name, email, password, pic);
   try {
     const config={
      headers:{
        "Content-Type":"application/json",

      },
     };
     const {data,status}= await axios.post("https://talk-buddy.onrender.com/api/users/register",{name,email,password,pic},config);

     console.log(status);
     console.log(data);
      if(status==201){toast({
        title: data.msg,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position:"top",
      });
      setLoading(false);
      localStorage.setItem("userInfo",JSON.stringify(data));
      navigate("/chats");
      return;}
      else if(status==200){
        toast({
          title: data.msg,
          status: 'warning',
          duration: 5000,
          isClosable: true,
          position:"top",
        });
      }
      else if(status==500){
        toast({
          title: data.msg,
          status: 'error',
          duration: 5000,
          isClosable: true,
          position:"top",
        });
      }
   } catch (error) {
    toast({
      title: 'Error occured!',
      // description:error.response.data.message,
      status: 'error',
      duration: 5000,
      isClosable: true,
      position:"top",
    })
    console.log(error);
    setLoading(false);
    return;
   }
  }
  return (
    <VStack spacing="5px">
      <FormControl id="first-name" isRequired>
        <FormLabel>Name</FormLabel>
        <Input
          placeholder="Enter Your Name"
          onChange={(e) => setName(e.target.value)}
        />
      </FormControl>
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Confirm Password</FormLabel>
        <InputGroup size="md">
          <Input
            type={show ? "text" : "password"}
            placeholder="Confirm password"
            onChange={(e) => setConfirmpassword(e.target.value)}
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Sign Up
      </Button>
    </VStack>
  )
}

export default Signup