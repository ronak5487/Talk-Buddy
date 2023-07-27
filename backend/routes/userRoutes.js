const express=require('express');
const {registeruser, loginuser, profileuser} = require('../controller/userController');
const router=express.Router();
const authenticate=require("../auth/authenticate")

router.post('/register',registeruser);
router.post('/login',loginuser);
router.get('/',authenticate,profileuser)

module.exports=router;