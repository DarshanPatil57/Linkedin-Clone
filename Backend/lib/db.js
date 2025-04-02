import mongoose from "mongoose"


export const connectDb = async ()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("MongoDB Connected");
    } catch (error) {
        console.log(error);
        
        console.log("Error connecting MongoDb"); 
        process.exit(1)
    }
}