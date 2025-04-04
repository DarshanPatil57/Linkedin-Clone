import Post from "../models/Post.model.js"
import cloudinary from "../lib/cloudinary.js";

export const getFeedPost =async (req,res)=>{
    try {
        const posts = await Post.find({
            author:{
                $in:req.user.connection
            }   
        }).populate("author" , "name username profilePicture headline").populate("comments.user","name profilePicture").sort({createdAt:-1})

        res.status(200).json(posts)
    } catch (error) {
        console.log("Error in getting feed posts" , error);
        res.status(500).json({
            message:"Internal server error"
        })
    }
}

export const createPost = async (req,res)=>{
    try {
        const {content,image} = req.body

        let newPost;
        if(image){
           const imgResult =  cloudinary.uploader.upload(image)
           newPost = new Post({
            author:req.user._id,
            content,
            image:imgResult
           })
        } else{
            newPost = new Post({
                author:req.user._id,
                content
            })
        }
        await newPost.save()

        res.status(201).json({
            message:"Post created"
        })
    } catch (error) {
        console.log("Error in creating post" , error);
        res.status(500).json({
            message:"Internal server error "
        })
    }
}

export const deletePost = async(req,res)=>{
    try {
        const id = req.params.id
        const userId = req.user._id

        const post = await Post.findById(id)

        if(!post){
            return res.status(404).json({
                message:"Post not found"
            })
        }

        // check the owner of the post
        if(post.author.toString() !== userId.toString()){
            return res.status(403).json({
                message:"Your are not authorized to delete post"
            })
        }

        // delete image from cloudinary
        if(post.image){
            await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0])
        }

        await Post.findByIdAndDelete(id)
        res.status(200).json({
            message:"Post deleted successfully"
        })
    } catch (error) {
     console.log("Error in deleting the post");
     res.status(500).json({
        message:"Internal server error"
     })   
    }
}

export const getPostById = async(req,res)=>{
    try {
        const id = req.params.id
        const post = await Post.findById(id).populate("author", "name username profilePicture headline").populate("comments.user" , "name profilePicture username headline")

        res.status(200).json(post)
    } catch (error) {
        console.log("Error in getting post by id " , error);
        res.status(500).json({
            message:"Internal server error "
        })
    }
}

export const createComment = async(req,res)=>{
    try {
        const id = req.params.id
        const {content} = req.body;

        const post = await Post.findByIdAndUpdate(id,{
            $push:{
                comments:{
                    user:req.user._id ,content
                }
            },
        },{new:true}).populate("author" ,"name email username profilePicture headline" )

        // creat notification for comments 
    } catch (error) {
        console.log("Error in commenting" , error);
        res.status(500).json({
            message:"Internal server error"
        })
    }
}