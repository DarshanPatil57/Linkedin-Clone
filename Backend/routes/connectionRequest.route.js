import express from "express"
import { protectRoute } from "../middleware/middleware.js"
import { acceptConnectionRequest, getConnectionRequest, getConnectionStatus, getUserConnections, rejectConnectionRequest, removeConnection, sendConnectionRequest } from "../controllers/connectionRequest.controller.js"


const router = express.Router()


router.post("/request/:userId",protectRoute,sendConnectionRequest)
router.put("/accept/:requestId",protectRoute,acceptConnectionRequest)
router.put("/reject/:requestId",protectRoute,rejectConnectionRequest)

// get all connection request for current user
router.get("/requests/",protectRoute,getConnectionRequest)   

//get all connections for a user
router.get("/",protectRoute,getUserConnections)
router.delete("/:userId",protectRoute,removeConnection)
router.get("/status/:userId",protectRoute,getConnectionStatus)


export default router