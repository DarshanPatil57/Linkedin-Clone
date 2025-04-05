import Notification from "../models/Notification.model.js";

export const getUserNotification = async (req,res)=>{
    try {
        const notification = await Notification.find({
            recipient:req.user._id
        }).sort({createdAt:-1}).populate("relatedUser", "name username profilePicture").populate("relatedPost","content image")

        res.status(200).json(notification)
    } catch (error) {
        console.log("Error in getting notification",error);
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const markNotificationAsRead = async (req,res)=>{
    const notificationId = req.params.id
    try {
        const notification = await Notification.findByIdAndUpdate({
            _id:notificationId,
            recipient:req.user._id,
        },{read:true},{new:true})

        res.json(notification)
    } catch (error) {
        console.log("Error in reading notification",error);
        res.status(500).json({
            message:"Internal server error"
        })
    }
}


export const deleteNotification = async (req,res)=>{
    const notificationId = req.params.id
    try {
        const notification = await Notification.findByIdAndDelete({
            _id:notificationId,
            recipient:req.user._id
        })
    } catch (error) {
        console.log("Error in deleting notification");
        res.status(500).json({
            message:"Internal server error"
        })
    }
}