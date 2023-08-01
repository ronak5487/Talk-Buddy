const userRoutes=require('./routes/userRoutes');
const chatRoutes=require("./routes/chatRoutes");
const messageroutes=require("./routes/messageroutes")
const express=require('express');
const app=express();
const cors=require('cors');
const dotEnv=require('dotenv');
const bodyParser=require('body-parser');
const mongoose=require('mongoose')

app.use(cors());
app.use(express.json()); // to accept json data
dotEnv.config({path:"./.env"});
mongoose.connect(process.env.MONGODB_CLOUD_URL,{
    useNewUrlParser:true, 
    useUnifiedTopology:true,
}).then(()=>{console.log("MONGODB CONNECT")})
.catch((err)=>console.log(err))
const port=process.env.PORT || 5053;

app.get('/',(req,res)=>{
    res.send("API is working")
})
app.use("/api/users",userRoutes);
app.use("/api/chats",chatRoutes);
app.use("/api/messages",messageroutes)

const server=app.listen(port, ()=>{
    console.log(`server is running on port ${port}`)
})
const io=require('socket.io')(server,{
    pingTimeout:60000,
    cors:{
        origin: "https://main--effortless-lily-7fd51c.netlify.app",

    }
});

io.on("connection",(socket)=>{
    console.log("Connected to socket.io");;

    socket.on('setup',(userData)=>{
        socket.join(userData._id);
        console.log(userData._id);
        socket.emit("connected");
    });
    socket.on("join chat",(room)=>{
     socket.join(room);
     console.log("User connected to room: "+room)
    }) ;
socket.on("typing",(room)=>socket.in(room).emit("typing",room))
socket.on("stop typing",(room)=>socket.in(room).emit("stop typing",room))
    socket.on("new message",(newmessage)=>{
        var chat = newmessage.chat;
        if(!chat)return console.log("chat doesnot exixts");
        chat.users.forEach((user) => {
            if(user._id===newmessage.sender._id)return;
        socket.in(user._id).emit("message recieved",newmessage);
        });
        
    })
    socket.off("setup",()=>{
        console.log("User DISCONNECTED")
        socket.leave(userData._id);
    })
})
