import User from "../models/User.model.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import { sendWelcomeEmail } from "../emails/emailHandler.js";

export const signup = async(req,res)=>{
    try {
        const {name,username,email,password} = req.body;

        if(!name || !username || !email || !password){
            return res.status(400).json({
                message:"All fields are required"
            })
        }

        // check email
        const existingEmail = await User.findOne({email})

        if(existingEmail){
            return res.status(400).json({
                message:"Email already Exists"
            })
        }

        // check username
        const existingUsername = await User.findOne({username})

        if(existingUsername){
            return res.status(400).json({
                message:"Username already exists"
            })
        }

        if(password.length < 6){
            return res.status(400).json({
                message:"Password must be at leaast 6 characters"
            })
        }
        // bcrypt
        const salt = await bcrypt.genSalt(10);

        const hashPassword =  await bcrypt.hash(password,salt)

        // create user 

        const user =  User.create({
            name,
            username,
            email,
            password:hashPassword
        })

        const token = jwt.sign({userId:user._id}, process.env.JWT_SECRET,{expiresIn:"3d"})

        res.cookie("jwt-linkedin",token,{
            httpOnly:true, //prevent xss attack
            maxAge:3*24*60*60*1000,
            sameSite:"strict", //prevent csrf attacks
            secure:process.env.NODE_ENV === "production" //prevent man in the middle attack
        })

        res.status(201).json({
            message:"User created successfully !"
        })

        // welcome email

        const profileUrl = process.env.CLIENT_URL+"/profile/"+user.username
        try {
            await sendWelcomeEmail(user.email,user.name,profileUrl)
        } catch (error) {
            console.log("Error sending welcome email", error);
        }

    } catch (error) {
        console.log("Error is signup", error);
        res.status(500).json({messgae:"Internal Server Error"})
        
    }
}

export  const login = async (req,res)=>{
    try {
    const {username,password} = req.body;

    // check for user exist 
    const userExist = await User.findOne({username});

    if(!userExist){
        return res.status(400).json({
            message:"Invalid credentials"
        })
    }

    // check password
    const isPasswordCorrect = await bcrypt.compare(password,userExist.password)

    if(!isPasswordCorrect){
        return res.status(400).json({
            message:"Invalid credentials"
        })
    }

    // create & send token 

    const token = jwt.sign({userId:userExist._id},process.env.JWT_SECRET,{expiresIn:"3d"})

    res.cookie('jwt-linkedin',token,{
        httpOnly:true, 
        maxAge:3*24*60*60*1000,
        sameSite:"strict", 
        secure:process.env.NODE_ENV === "production" 
    })
    
    res.status(201).json({
        message:"User logged in successfully !"
    })
        
    } catch (error) {
        console.log("Error is login", error);
        res.status(500).json({messgae:"Internal Server Error"})
        
    }
}

export const logout = async(req,res)=>{
    res.clearCookie("jwt-linkedin")
    res.json({
        message:"Logged out successfully"
    })
}

export const getCurrentUser = async(req,res)=>{
    try {
        res.json(req.user)
    } catch (error) {
        console.log("Error in getting user", error);
        res.status(500).json({
            message:"Internal server error "
        })
        
    }
}