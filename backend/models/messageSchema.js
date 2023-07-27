const mongoose=require('mongoose');

const messageSchema=new mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'user'
    },
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'chat'
    },
    content:{
        type:String,
        trim:true
    }
},{
    timestamps:true
})
const message=mongoose.model('message',messageSchema);
module.exports=message;
