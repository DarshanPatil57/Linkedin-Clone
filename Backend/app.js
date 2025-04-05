import express from "express"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { connectDb } from "./lib/db.js"

//routes imports
import authRoute from "./routes/auth.route.js"
import userRoute from "./routes/user.route.js"
import postRoute from "./routes/post.route.js"
import notificationRoute from "./routes/notification.route.js"
import connectionRoute from "./routes/connectionRequest.route.js"

dotenv.config()
const app  = express()
const PORT = process.env.PORT || 3000


app.use(express.json()) //middleware
app.use(cookieParser())

app.use("/api/v1/auth" ,authRoute)
app.use("/api/v1/users" ,userRoute)
app.use("/api/v1/posts" ,postRoute)
app.use("/api/v1/notification" ,notificationRoute)
app.use("/api/v1/connection" ,connectionRoute)



app.listen(PORT , () => {
    console.log("Port listning to 3000");
    connectDb()
})
    