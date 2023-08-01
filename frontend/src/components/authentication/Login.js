import { Button, FormControl, FormLabel, Input, InputGroup, InputRightElement, VStack, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [show,setShow]=useState(false);
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [loading,setLoading]=useState(false);
  const toast=useToast();
  const navigate=useNavigate();
  const handleClick=()=>{setShow(!show)}
  const submitHandler=async()=>{
     setLoading(true);
    if(!email || ! password){
      setLoading(false);
      toast({
        title: 'Please fill all the details',
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
          "content-type":"application/json"
      }
    }
    const {status,data}= await axios.post("https://talk-buddy.onrender.com/api/users/login",{email,password},config);
    console.log(data);
    setLoading(false);
      if(status==201){toast({
        title:data.msg,
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position:"top",
      });
    return;}
      if(status==200){toast({
        title:data.msg,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position:"top",
      });
    }
      localStorage.setItem("userInfo",JSON.stringify(data));
      navigate("/chats");

      
   
  }
  catch(err){
    console.log(err);
    setLoading(false);
    toast({
      title:err.response.data.msg,
      status: 'error',
      duration: 5000,
      isClosable: true,
      position:"top",
    });
    return;

  }
  }
  return (
    <VStack spacing="10px">
      <FormControl id="email" isRequired>
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password" isRequired>
        <FormLabel>Password</FormLabel>
        <InputGroup size="md">
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
          <InputRightElement width="4.5rem">
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={loading}
      >
        Login
      </Button>
      <Button
        variant="solid"
        colorScheme="red"
        width="100%"
        onClick={() => {
          setEmail("guest@example.com");
          setPassword("123456");
        }}
      >
        Get Guest User Credentials
      </Button>
    </VStack>
  )
}

export default Login