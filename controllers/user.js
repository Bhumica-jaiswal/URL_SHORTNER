const {v4:uuidv4}=require('uuid')
const User=require('../models/user')
const{setUser}=require('../service/auth');
const { set } = require('mongoose');

async function handleUserSignUp(req,res){
    const {name,email,password}=req.body;
    await User.create({
        name,
        email,
        password,
    })
    return res.render("home")
}
async function handleUserLogin(req,res){
    const {email,password}=req.body;
     const user=await User.findOne({
        email,
        password,
    })
    if(!user){
        return res.render("login",{
            error:"Invalid EmailId or Password",
        })
    }
    const token=setUser(user)
    res.cookie("uid",token)
    return res.render("home")
}

module.exports={
    handleUserSignUp,
    handleUserLogin,
    
}