import mongoose from "mongoose";

const connectionRequestSchema =  mongoose.Schema({
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    recipient:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
    status:{
        type:String,
        enum:["pending","accepted","rejected"],
        default:"pending",
    },
},{timestamps:true})

const ConnectionRequest = new mongoose.model("ConnectionRequest",connectionRequestSchema)
export default ConnectionRequest