const { default: mongoose } = require("mongoose");
const chat = require("../models/chatSchema");
const message = require("../models/messageSchema");
const User = require("../models/userSchema");

const messages=async(req,res)=>{
    try{
        const chatId=new mongoose.Types.ObjectId(req.params.chatId)
       const allmess=await message.find({chat:chatId}).populate("sender","name pic email").populate("chat")
       return res.json(allmess);

    }
    catch(err){
      console.log(err);
      res.status(500).json({msg:err});
    }
}
const sendmessages=async(req,res)=>{
  try{
     let {content,chatId}=req.body;
     let userId=req.user._id
     if(!content || !chatId){
        res.status(400).send("Invalid data Passed into request");
        return;
     }
     const usermessage=await message.create({content,chat:chatId,sender:userId});
     const populatedMessage = await message
     .findById(usermessage._id)
     .populate("sender", "name pic")
     .populate({
       path: "chat",
       populate: {
         path: "users",
         select: "name email pic",
       },
     })
     .exec();
    //  console.log(populatedMessage);
     await chat.findByIdAndUpdate(
        chatId,
        {
            latestmessage:populatedMessage
        }

     )
     res.status(200).send(populatedMessage)
  }
  catch(err){
    console.log(err);
    res.status(500).json({msg:err});
  }
}

module.exports={messages,sendmessages}