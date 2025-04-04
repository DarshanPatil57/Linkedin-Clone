import express from 'express'
import { protectRoute } from '../middleware/middleware.js'
import { createPost, deletePost, getFeedPost, getPostById } from '../controllers/post.controller.js'

const router = express.Router()


router.get("/",protectRoute, getFeedPost )
router.post("/create", protectRoute , createPost)
router.delete("/delete/:id", protectRoute, deletePost)
router.get("/:id", protectRoute, getPostById)
router.get("/:id/comment", protectRoute, createComment)

export default router