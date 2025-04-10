import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import Sidebar from '../components/Sidebar'
import { PostCreation } from '../components/PostCreation'
import Post from '../components/Post'
import { Users } from 'lucide-react'

export const HomePage = () => {

  const {data:authUser} = useQuery({queryKey:["authUser"]})

  // suggested user  

  const {data:recommendedUser} = useQuery({
    queryKey:["recommendedUser"],
    queryFn: async ()=>{
      try {
        const res = await axiosInstance.get("/users/suggestions")
        return res.data
      } catch (error) {
        toast.error(error.response.data.message || "Something went wrong")
      }
    }
  })

  // post 

  const {data:posts} = useQuery({
    queryKey:["posts"],
    queryFn: async ()=>{
      try {
        const res = await axiosInstance.get("/posts")
        return res.data
      } catch (error) {
        toast.error(error.response.data.message || "Something went wrong")
      }
    }
  })

  // console.log("Suggetsed user : " ,recommendedUser);
  // console.log("Posts:",posts);
  
  
  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='hidden lg:block lg:col-span-1'>
      <Sidebar user={authUser}/>
      </div>

      <div className='col-span-1 lg:col-span-2 order-first lg:order-none'>
        <PostCreation user={authUser}/>

        {posts?.map(post => <Post key={post.id} post={post}/>)}

        {posts?.length === 0 && (
					<div className='bg-white rounded-lg shadow p-8 text-center'>
						<div className='mb-6'>
							<Users size={64} className='mx-auto text-blue-500' />
						</div>
						<h2 className='text-2xl font-bold mb-4 text-gray-800'>No Posts Yet</h2>
						<p className='text-gray-600 mb-6'>Connect with others to start seeing posts in your feed!</p>
					</div>
				)}
      </div>
    </div>
  )
}
