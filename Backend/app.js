import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { connectDb } from "./lib/db.js"
import cors from 'cors'
import path from "path"
import { fileURLToPath } from 'url';

//routes imports
import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import notificationRoute from "./routes/notification.route.js"
import connectionRoute from "./routes/connectionRequest.route.js"

dotenv.config()
const app  = express()
const PORT = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


if(process.env.NODE_ENV !== "production"){
    app.use(cors({
        origin:"http://localhost:5173",
        credentials:true
    }))
}

app.use(express.json({limit:"5mb"})) //middleware
app.use(cookieParser())

app.use("/api/v1/auth" ,authRoute)
app.use("/api/v1/users" ,userRoute)
app.use("/api/v1/posts" ,postRoute)
app.use("/api/v1/notification" ,notificationRoute)
app.use("/api/v1/connection" ,connectionRoute)

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "..", "FrontEnd", "dist")));

    app.get("*", (req, res) => {
      res.sendFile(path.resolve(__dirname, "..", "FrontEnd", "dist", "index.html")); 
    });
}
console.log(path.join(__dirname, "FrontEnd", "dist"));

  console.log(`Serving from: ${path.join(__dirname, "FrontEnd", "dist")}`);

  

app.listen(PORT , () => {
    console.log("Port listning to 3000");
    connectDb()
})
