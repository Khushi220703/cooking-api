const express = require("express");
const router = express.Router();
const Model = require("../models/userModel");
const transport = require("../config/mailConfig");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const otpStorage = {};



// These route handles request for otp, signup and login.

/*--------------------------------------------------------------------------Send otp--------------------------------------------------------------------------------------------*/
// This route handle send otp requests.
router.post("/sendotp", async (req,res)=>{
    const email = req.body.email;
    console.log("hi");
    //find if user is not existing in db.
    try {
        if( await Model.findOne({email:email})){
          console.log("hi");
          
           
           res.status(400).json({ message: "Email already exists" });
        }
        else{ // if no user such exists generate otp for that user.
        const otp = otpGenerator.generate(4,{ digits:true, specialChars: false, alphabets: false });
        
        const mailOptions = {
            from: process.env.ACCOUNT,
            to: email,
            subject: 'Your OTP Code',
            text: `Your OTP code is ${otp}`
        };
         console.log("hi",mailOptions);
         
        await transport.sendMail(mailOptions);
        res.status(200).json({message:"OTP sent"});
        }
    } catch (error) {
        console.log(error);
        
        res.status(500).send(error);
    }
})


/*-----------------------------------------------------------------------------Verify and signup-----------------------------------------------------------------------------------*/
// handle signup requets it hashes passowrd and verify otp and store data in db.
router.post("/signup", async (req,res)=>{
  
    var {name, email, password, age, city, gender,number} = req.body;
    try {

        password = await bcrypt.hash(password, 10);
        //console.log(hashedPassword);
        
        if(number === otpStorage[email]){
           // console.log(req.body);
            const user = new Model({name, email, password, age, city, gender});
            await user.save();
            delete otpStorage[email];
            res.send(user);
        }
        else{
            res.status(400).send("Wrong otp");
        }
        
        
    } catch (error) {
        console.log(error);
        
        res.send(error);
    }
})


/*--------------------------------------------------------------------------Login Route---------------------------------------------------------------------------------------------*/
// when user come to login it cheks whether user exits and if yes match password.

router.post("/login", async (req,res)=>{
    const email = req.body.email;
    const password = req.body.password;
    console.log(email,password);
    
    
    try {
       
       console.log(email);
       
        const user = await Model.findOne({email:email});//find user with given email id.
        console.log(await bcrypt.compare(password,user.password));
        if(await bcrypt.compare(password,user.password)){ // if email present check password.
            
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            console.log(token);
            
            res.status(200).json({ token,user });
            
        }
        else{
            
            
            res.status(400).json({message:"User not found"});
        }
    } catch (error) {
        res.status(400).json({message:"There is an error from our end",error});
       
    }
})

module.exports = router;