const mongoose = require("mongoose");
const chat = require("../models/chatSchema");
const User = require("../models/userSchema");

const accesschat = async (req, res) => {
  let { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ msg: "Params does not contain userId" });
  }
  const userobjid = new mongoose.Types.ObjectId(userId);
  // console.log(userobjid);
  // console.log(req.user._id);
  let ischat = await chat
    .find({
      isgroupchat: false,

      users: { $all: [req.user._id, userobjid] },
    })
    .populate("users", "-password")
    .populate("latestmessage");

  ischat = await User.populate(ischat, {
    path: "latestmessage",
    select: "name email pic",
  });
  // console.log(ischat);
  if (ischat.length > 0) {
    return res.send(ischat[0]);
  }

  try {
    // console.log("ronak");
    var chatdata = {
      isgroupchat: false,
      users: [req.user._id, userobjid],
      chatname: "sender",
    };
    // console.log(chatdata);
    const chatcreate = await chat.create(chatdata);
    // console.log(2);
    // console.log(chatcreate);
    const fullchat = await chat
      .findOne({ _id: chatcreate._id })
      .populate("users", "-password");
    // console.log(fullchat);
    res.status(200).send(fullchat);
    return;
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error occured" });
  }
};
const fetchchat = async (req, res) => {
  try {
    let allchat = await chat
      .find({ users: { $in: [req.user._id] } })
      .populate("users", "-password")
      .populate("latestmessage")
      .populate("groupadmin")
      .sort({updatedAt:-1})
    allchat = await User.populate(allchat, {
      path: "latestmessage",
      select: "name email pic",
    });
    // console.log(allchat);
    res.status(200).send(allchat);
  } catch (err) {
    console.log(err);
    res.status(400).json({ msg: "Error occured" });
  }
};

const creategroup=async(req,res)=>{
try{
   if(!req.body.users || !req.body.name){
    return res.status(200).json({msg:"Please fill all the details"})
   }
   req.body.users.push(req.user);
   let grp=await chat.create({
    isgroupchat:true,
    users:req.body.users,
    groupadmin:req.user._id,
    chatname:req.body.name

   })
   const fullchat = await chat.findOne({_id:grp._id}).populate("users","-password").populate("groupadmin","-password");
   res.status(200).send(fullchat);
}
catch(err){
    console.log(err);
    res.status(500).json({msg:"Error Ocuured"})
}
}

const rename=async(req,res)=>{
try{
    let {chatname,chatId}=req.body;
   if(!chatname){
    return res.status(400).json("Please provide new chatname");
   }
   var newchat=await chat.findByIdAndUpdate(
    chatId,
    {
        chatname
    },{
        new:true
    }
   ).populate("users","-password").populate("groupadmin","-password");
   if(!newchat){
    return res.status(400).send("chat not found")
   }
   else return res.status(200).send(newchat);
}
catch(err){
    console.log(err);
    res.status(500).json({msg:"Error Ocuured"})
}
}
const addtogrp=async(req,res)=>{
    try{
        let{userId,chatid}=req.body;
        if(!userId || !chatid){
            return res.status(400).send("Please provide user id to be added")
        }
        let chats=await chat.findById(chatid);
          if(!(chats.isgroupchat)){
            return res.status(400).send("this is not a group chat")
          }
        if((chats.users).includes(userId)){
            return res.status(400).send("user already present in group");
        }
        chats.users.push(userId);
        let newchat=await chat.findByIdAndUpdate(
           chatid,
           {
            users:chats.users
           } ,
           {
            new:true
           }
        ).populate("users","-password").populate("groupadmin","-password")
        if(!newchat){
            res.status(400).send("chatnot found");
        }
        else{
            res.status(200).send(newchat);
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg:"Error Ocuured"})
    }
}
const removefromgrp=async(req,res)=>{
    try{
        let {userId,chatId}=req.body;
        if(!userId || !chatId){
            return res.statu(400).send("Please provide data")
        }
        let chats=await chat.findById(chatId);
        if(!chats.users.includes(userId)){
            return res.status(400).send("User not present in the group")
        }
           var users=chats.users.filter((obj)=>obj!=userId);
        var newchat=await chat.findByIdAndUpdate(
            chatId,
            {
                users:users
            },
            {
                new:true
            }
        ).populate("users","-password").populate("groupadmin","-password")
        if(!newchat){
            res.status(400).send("chatnot found");
        }
        else{
            res.status(200).send(newchat);
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg:"Error Ocuured"})
    }
}

module.exports = { accesschat, fetchchat,creategroup,rename ,addtogrp,removefromgrp};
