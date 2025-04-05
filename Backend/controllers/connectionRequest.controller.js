import { sendConnectionAcceptedEmail } from "../emails/emailHandler.js";
import connectionRequest from "../models/connectionRequest.model.js";
import Notification from "../models/Notification.model.js";
import User from "../models/User.model.js";

export const sendConnectionRequest = async(req,res)=>{
    try {
        const {userId} = req.params;
        const senderId = req.user._id;

        if(senderId.toString() === userId){
            return res.status(400).json({
                message:"You cannot send request to yourself"
            })
        }

        if(req.user.connectios.includes(userId)){
            return res.status(400).json({
                message:"You are already connected"
            })
        }

        const existingRequest = new connectionRequest.findOne({
            sender:senderId,
            recipient:userId,
            status:"pending"
        })

        if(existingRequest){
            return res.status(400).json({
                message:"A connection request already exists"
            })
        }

        const newRequest = new connectionRequest({
            sender:senderId,
            recipient:userId
        })

        await newRequest.save()

    } catch (error) {
        console.log("Error in sending connection request",error);
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const acceptConnectionRequest = async(req,res)=>{
    try {
        const {requestId} = req.params
        const userId = req.user._id

        const request = await connectionRequest.findById(requestId)
        .populate("sender","name email username")
        .populate("recipient","name  username")

        if(!request){
            return res.status(404).json({
                message:"Connection request not found"
            })
        }

        // check if request is for current user
        if(request.recipient._id.toString() !== userId.toString()){
            return res.status(403).json({
                message:"Not authorized to accept the request"
            })
        }

        if(request.status !=="pending"){
            return res.status(400).json({
                message:"This request has already been processed"
            })
        }

        request.status = "accepted"

        await request.save()

        // save connection to connections list after accepted

        await User.findByIdAndUpdate(request.sender._id,{
            $addToSet:{
                connections:userId
            }
        })
        
        await User.findByIdAndUpdate(userId,{
            $addToSet:{
                connections:request.sender._id
            }
        })

        // create notification

        const notification = new Notification({
            recipient:request.sender._id,
            type:"connectionAccepted",
            relatedUser:userId
        })

        await notification.save()

        res.json({
            message:"Connection accepted successfully"
        })

        // send email

        const senderEmail = request.sender.email
        const senderName = request.sender.name
        const recipientName = request.recipient.name
        const profileUrl = process.enV.CLIENT_URL+"/profile/"+request.recipient.username

        try {
            await sendConnectionAcceptedEmail(senderEmail,senderName,recipientName,profileUrl)
        } catch (error) {
            console.log("Error in sending connection request email",error);
        }


    } catch (error) {
        console.log("Error in accepting connection request",error);
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const rejectConnectionRequest = async(req,res)=>{
    try {
        
    } catch (error) {
        console.log("Error in sending connection request",error);
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const getConnectionRequest = async(req,res)=>{
    try {
        
    } catch (error) {
        console.log("Error in sending connection request",error);
        res.status(500).json({
            message:"Internal server error"
        })
    }
}
export const getUserConnections = async(req,res)=>{
    try {
        
    } catch (error) {
        console.log("Error in sending connection request",error);
        res.status(500).json({
            message:"Internal server error"
        })
    }
}
export const removeConnection = async(req,res)=>{
    try {
        
    } catch (error) {
        console.log("Error in sending connection request",error);
        res.status(500).json({
            message:"Internal server error"
        })
    }
}
export const getConnectionStatus = async(req,res)=>{
    try {
        
    } catch (error) {
        console.log("Error in sending connection request",error);
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

