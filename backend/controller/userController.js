
const User=require('../models/userSchema');
const bcrypt=require('bcryptjs')
const jwt=require('jsonwebtoken')

const registeruser=async (req,res)=>{
    try{

        let {name,email,password,pic}=req.body;
        let user=await User.findOne({email});
        if(user){
           res.status(200).json({msg:"User already exists"});
           return;

        }
         let salt= await bcrypt.genSalt(10);
         password=await bcrypt.hash(password,salt);
        //  console.log(password);
        //  console.log(pic);
         user= new User({name,email,password,pic});
         await user.save();
         let payload={
            user:{
                id:user._id,
                name:user.name,
            }
         }
         jwt.sign(payload,process.env.JWT_SECRET_KEY, (error,token)=>{
            if(error){
                res.status(500).json({msg:"No Token found"})
                return;
            }
        res.status(201).json({
            _id: user._id,
            name:user.name,
            email:user.email,
            pic:user.pic,
            token:token,
            msg:"User Registered successfully"
        });
        return ;
    })
    }
    catch(err){
        console.log(err);
        res.status(500).json({msg:"error occured"});
       return;
        
    }
}

const loginuser=async (req,res)=>{
 try{
     let {email,password}=req.body;
     let user=await User.findOne({email:email});
     if(!user){
        res.status(201).json({msg:"User not registered"});
        return;
     }
     let ismatch=await bcrypt.compare(password,user.password);
     if(!ismatch){
        res.status(201).json({msg:"Invalid Credentials"});
       return;
     }
     let payload={
        user:{
            id:user._id,
            name:user.name,
        }
     }
     jwt.sign(payload,process.env.JWT_SECRET_KEY, (error,token)=>{
        if(error){
            // throw new Error("No Token Found");
            res.status(500).json({msg:"No Token found"})
            return;
        }
        res.status(200).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            token:token,
            msg:"logged in successfully"
        })
     })
 }
 catch(err){
       res.status(500).json({msg:"Invalid user"});
       return;
 }
}
const profileuser=async(req,res)=>{
  const keyword=req.query.search?{
   $or: [
    {name: {$regex:req.query.search,$options:'i'}},
    {email: {$regex:req.query.search,$options:'i'}},

   ]
  }:{};
  const users=await User.find(keyword).find({_id:{$ne:req.user._id}}).select("-password");
  res.send(users);
}
module.exports={registeruser,loginuser,profileuser};