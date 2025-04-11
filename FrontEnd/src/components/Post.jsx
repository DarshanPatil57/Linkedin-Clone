import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'
import PostAction from './PostAction'
import { Loader, MessageCircle, Send, Share2, ThumbsUp, Trash2 } from 'lucide-react'

export default function Post({post}) {

  const {data:authUser} = useQuery({queryKey:["authUser"]})
  const [showComment,setShowComment] = useState(false)
  const [newComment,setNewComment] = useState("")
  const [comments,setComments] = useState(post.comments || [])

  const isOwner = authUser._id === post.author._id
  const isLiked = post.likes.includes(authUser._id)

  const queryClient = useQueryClient()

  // delet post

  const {mutate:deletePost,isPending:isDeletingPost} = useMutation({
    mutationFn: async ()=>{
      await axiosInstance.delete(`/posts/delete/${post._id}`)
    },
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey:["posts"]});
      toast.success("Post deleted successfully")
    },
    onError:(err)=>{
      toast.error(err.response.data.message || "Something went wrong")
  }
  })

  // create comments 
  const {mutate:createComment, isPending:isCreatingComment} = useMutation({
    mutationFn: async(newComment) =>{
      await axiosInstance.post(`/posts/${post._id}/comment`,{content:newComment})
    },onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey:["posts"]});
      toast.success("Comment added successfully")
    },
    onError:(err)=>{
      toast.error(err.response.data.message || "Something went wrong")
  }
  })

  // like post

  const {mutate:likePost, isPending:isLikingPost} = useMutation({
    mutationFn: async()=>{
      await axiosInstance.post(`/posts/${post._id}/like`)
    },
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey:["posts"]});
      // toast.success("Post liked")
    },
    onError:(err)=>{
      toast.error(err.response.data.message || "Something went wrong")
  }
  })

  const handleDeletePost = () => {
		if (!window.confirm("Are you sure you want to delete this post?")) return;
		deletePost();
	};

	const handleLikePost = async () => {
		if (isLikingPost) return;
		likePost();
	};

	const handleAddComment = async (e) => {
		e.preventDefault();
		if (newComment.trim()) {
			createComment(newComment);
			setNewComment("");
			setComments([
				...comments,
				{
					content: newComment,
					user: {
						_id: authUser._id,
						name: authUser.name,
						profilePicture: authUser.profilePicture,
					},
					createdAt: new Date(),
				},
			]);
		}
	};

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const commentDate = new Date(dateString);
    const diff = Math.floor((now - commentDate) / 1000); // in seconds
  
    if (diff < 60) return `${diff} sec ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
    if (diff < 604800) return `${Math.floor(diff / 86400)} day ago`;
  
    return commentDate.toLocaleDateString(); // fallback for older dates
  };
  
  return (
		<div className='bg-secondary rounded-lg shadow mb-4'>
			<div className='p-4'>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center'>
						<Link to={`/profile/${post?.author?.username}`}>
							<img
								src={post.author.profilePicture || "/avatar.png"}
								alt={post.author.name}
								className='size-10 rounded-full mr-3'
							/>
						</Link>

						<div>
							<Link to={`/profile/${post?.author?.username}`}>
								<h3 className='font-semibold'>{post.author.name}</h3>
							</Link>
							<p className='text-xs text-info'>{post.author.headline}</p>
							<p className='text-xs text-info'>
								{/* {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })} */}
                {getRelativeTime(post.createdAt)}
							</p>
						</div>
					</div>
					{isOwner && (
						<button onClick={handleDeletePost} className='text-red-500 hover:text-red-700 cursor-pointer'>
							{isDeletingPost ? <Loader size={18} className='animate-spin' /> : <Trash2 size={15} />}
						</button>
					)}
				</div>
				<p className='mb-4'>{post.content}</p>
				{post.image && <img src={post.image} alt='Post content' className='rounded-lg w-full mb-4' />}

				<div className='flex justify-between text-info'>
					<PostAction
						icon={<ThumbsUp size={18} className={isLiked ? "text-blue-500  fill-blue-300" : " cursor-pointer"}  />}
						text={`Like (${post.likes.length})`}
						onClick={handleLikePost}
					/>

					<PostAction
						icon={<MessageCircle size={18} className=' cursor-pointer' />}
						text={`Comment (${comments.length})`}
						onClick={() => setShowComment(!showComment)}
					/>
					<PostAction icon={<Share2 size={18} className=' cursor-pointer' />} text='Share' />
				</div>
			</div>

			{showComment && (
				<div className='px-4 pb-4'>
					<div className='mb-4 max-h-60 overflow-y-auto'>
						{comments.map((comment) => (
							<div key={comment._id} className='mb-2 bg-base-100 p-2 rounded flex items-start'>
								<img
									src={comment.user.profilePicture || "/avatar.png"}
									alt={comment.user.name}
									className='w-8 h-8 rounded-full mr-2 flex-shrink-0'
								/>
								<div className='flex-grow'>
									<div className='flex items-center mb-1'>
										<span className='font-semibold mr-2'>{comment.user.name}</span>
										<span className='text-xs text-info'>
											{/* {formatDistanceToNow(new Date(comment.createdAt))} */}
                      {getRelativeTime(comment.createdAt)}
										</span>
									</div>
									<p>{comment.content}</p>
								</div>
							</div>
						))}
					</div>

					<form onSubmit={handleAddComment} className='flex items-center'>
						<input
							type='text'
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder='Add a comment...'
							className='flex-grow p-3 rounded-l-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary'
						/>

						<button
							type='submit'
							className='bg-gray-100 ml-1 text-blue p-3 rounded-full hover:bg-primary-dark transition cursor-pointer duration-300'
							disabled={isCreatingComment}
						>
							{isCreatingComment ? (<Loader size={18} className='animate-spin' /> ): (<Send size={18} />)}
						</button>
					</form>
				</div>
			)}
		</div>
	);
}
