import jwt from "jsonwebtoken"
import User from "../models/User.model"

export const protectRoute =  async (req,res,next)=>{
    try {
        const token = req.cookies["jwt-linkedin"]

        if(!token){
            return res.status(401).json({
                message:"Unauthorizrd - No token provided"
            })
        }

        const decode = jwt.verify(token,process.env.Jwt_secret)

        if(!decode){
            return res.status(401).json({
                message:"Unauthorized - Invalid Token "
            })
        }

        const user = await User.findById(decode.userId).select("-password")

        if(!user){
            return res.status(401).json({
                message:"User not found"
            })
        }

        req.user = user
        next()
    } catch (error) {
        console.log("Error in protctRoute Middleware", error);
        res.status(500).json({
            message:"Internal server error"
        })
        
    }
}