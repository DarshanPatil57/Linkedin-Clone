import express from "express"
import { getCurrentUser, login, logout, signup } from "../controllers/auth.controller.js"
import { protectRoute } from "../middleware/middleware.js"

const router = express.Router()


router.post("/signup", signup)
router.post("/signin",login)
router.post("/logout",logout)

router.get("/me",protectRoute,getCurrentUser)

export default router