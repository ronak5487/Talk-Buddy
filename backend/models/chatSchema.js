const mongoose=require('mongoose');

const chatSchema=new mongoose.Schema({
    chatname:{
        type:String,
        trim:true
    },
    isgroupchat:{
        type:Boolean
    },
    users:[{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    }],
    groupadmin:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    latestmessage:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'message'
    },
},{
    timestamps:true
})

const chat=mongoose.model('chat',chatSchema);
module.exports=chat;