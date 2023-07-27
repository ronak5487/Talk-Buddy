const express=require("express");
const authenticate = require("../auth/authenticate");
const { sendmessages, messages } = require("../controller/messagecontroller");
const router=express();
router.post("/sendmessage",authenticate,sendmessages);
router.get("/:chatId",authenticate,messages);
module.exports=router;