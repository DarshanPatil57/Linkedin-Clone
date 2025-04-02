import express from "express"
import dotenv from "dotenv"
import { connectDb } from "./lib/db.js"

//routes imports
import authRoute from "./routes/auth.route.js"

dotenv.config()
const app  = express()
const PORT = process.env.PORT || 3000


app.use(express.json()) //middleware

app.use("/api/v1/auth" ,authRoute)



app.listen(PORT , () => {
    console.log("Port listning to 3000");
    connectDb()
})
    