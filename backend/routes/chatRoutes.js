const express=require('express');
const { accesschat, fetchchat, creategroup, rename, addtogrp, removefromgrp } = require('../controller/chatController');
const authenticate = require('../auth/authenticate');
const router=express();
router.post("/accesschat",authenticate,accesschat)
router.get("/fetchchat",authenticate,fetchchat)
router.post("/creategroup",authenticate,creategroup)
router.put("/rename",authenticate,rename)
router.put("/addtogrp",authenticate,addtogrp)
router.put("/removefromgrp",authenticate,removefromgrp)
module.exports=router;