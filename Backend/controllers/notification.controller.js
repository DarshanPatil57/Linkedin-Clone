import Notification from "../models/Notification.model.js";

export const getUserNotification = async (req,res) => {
    try {
        // console.log("Getting notifications for user:", req.user._id);
        
        const notification = await Notification.find({
            recipient: req.user._id
        })
        .sort({createdAt: -1})
        .populate("relatedUser", "name username profilePicture")
        .populate("relatedPost", "content image");
        
        // console.log("Found notifications:", notification.length);
        
        res.status(200).json(notification);
    } catch (error) {
        console.log("Error in getting notification", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}

export const markNotificationAsRead = async (req,res) => {
    const notificationId = req.params.id
    try {
        const notification = await Notification.findOneAndUpdate(
            {
                _id: notificationId,
                recipient: req.user._id,
            },
            { read: true },
            { new: true }
        );
        
        if (!notification) {
            return res.status(404).json({
                message: "Notification not found or you don't have permission to update it"
            });
        }
        
        res.json(notification);
    } catch (error) {
        console.log("Error in reading notification", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}


export const deleteNotification = async (req,res)=>{
    const notificationId = req.params.id
    try {
        const notification = await Notification.findByIdAndDelete({
            _id:notificationId,
            recipient:req.user._id
        })
        res.status(200).json({
            message: "Notification deleted successfully"
        });
    } catch (error) {
        console.log("Error in deleting notification");
        res.status(500).json({
            message:"Internal server error"
        })
    }
}