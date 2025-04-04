import express from 'express'
import { protectRoute } from '../middleware/middleware.js'
import { getPublicProfile, getSuggestedConnection, updateProfile } from '../controllers/user.controller.js'

const router = express.Router()

router.get("/suggestions", protectRoute , getSuggestedConnection)
router.get("/:username", protectRoute , getPublicProfile)

router.put("/profile", protectRoute,updateProfile)


export default router