import User from "../models/User.model";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const signup = async(req,res)=>{
    try {
        const {name,username,email,password} = req.body;

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

        const user = new User.create({
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
    } catch (error) {
        console.log("Error is signup", error);
        res.status(500).json({messgae:"Internal Server Error"})
        
    }
}

export  const login = async (req,res)=>{

}

export const logout = async(req,res)=>{

}