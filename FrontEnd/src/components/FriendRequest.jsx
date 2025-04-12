import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

export const FriendRequest = ({request}) => {

    const queryClient = useQueryClient()

    // acceot requests
    const {mutate:acceptRequest} = useMutation({
        mutationFn: async (requestId)=>{
            const res = await axiosInstance.put(`/connection/accept/${requestId}`)
            return res.data
        },
        onSuccess: () => {
            toast.success("Connection request accepted")
            queryClient.invalidateQueries({ queryKey: ['allConnectionRequest'] })
          },
          onError: (err) => {
            toast.error(err?.response?.data?.message || 'Something went wrong')
          },
    })

    // reject requests
    const {mutate:rejectRequest} = useMutation({
        mutationFn: async (requestId)=>{
            const res = await axiosInstance.put(`/connection/reject/${requestId}`)
            return res.data
        },
        onSuccess: () => {
            toast.success("Connection request rejected")
            queryClient.invalidateQueries({ queryKey: ['allConnectionRequest'] })
          },
          onError: (err) => {
            toast.error(err?.response?.data?.message || 'Something went wrong')
          },
    })
  return (
    <div>
        <div className='bg-white rounded-lg shadow p-4 flex items-center justify-between transition-all hover:shadow-md'>
			<div className='flex items-center gap-4'>
				<Link to={`/profile/${request.sender.username}`}>
					<img
						src={request.sender.profilePicture || "/avatar.png"}
						alt={request.name}
						className='w-16 h-16 rounded-full object-cover'
					/>
				</Link>

				<div>
					<Link to={`/profile/${request.sender.username}`} className='font-semibold text-lg'>
						{request.sender.name}
					</Link>
					<p className='text-gray-600'>{request.sender.headline}</p>
				</div>
			</div>

			<div className='space-x-2'>
				<button
					className='bg-blue-400 cursor-pointer text-black px-4 py-2 rounded-md hover:bg-primary-dark transition-colors'
					onClick={() => acceptRequest(request._id)}
				>
					Accept
				</button>
				<button
					className='bg-red-400 cursor-pointer text-black px-4 py-2 rounded-md  transition-colors'
					onClick={() => rejectRequest(request._id)}
				>
					Reject
				</button>
			</div>
		</div>
    </div>
  )
}

