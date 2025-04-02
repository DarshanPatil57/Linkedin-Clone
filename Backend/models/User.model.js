import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    profilePicture:{
        type:String,
        default:""
    },
    banner:{
        type:String,
        default:"",
    },
    headline:{
        type:String,
        default:"Linkedin User"
    },
    location:{
        type:String,
        default:"Earth"
    },
    about:{
        type:String,
        default:""
    },
    skills:[String],
    experiences:[
        {
            title:String,
            company:String,
            startDate:Date,
            endDate:Date,
            description:String
        },
    ],
    education:[
        {
            school:String,
            fieldOfStudy:String,
            startYear:Number,
            endYear:Number

        },
    ],
    connections:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]
},{timestamps:true})

const User = mongoose.model("User",UserSchema);

export default User