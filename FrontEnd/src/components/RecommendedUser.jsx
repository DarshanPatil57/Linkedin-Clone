import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import { Check, Clock, UserCheck, UserPlus, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export const RecommendedUser = ({user}) => {

  const queryClient = useQueryClient()

  const { data: connectionStatus, isLoading } = useQuery({
    queryKey: ["connectionStatus", user._id],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get(`/connection/status/${user._id}`);
		// console.log("Connection status response:", res.data);
        return res.data;
      } catch (error) {
        toast.error(error?.response?.data?.message || "Something went wrong");
        return null;
      }
    },
  });
  

  // send connection request
  const { mutate: sendConnectionRequest } = useMutation({
    mutationFn: async (userId) => {
		// console.log("Sending connection request to:", userId);
      const res = await axiosInstance.post(`/connection/request/${userId}`);
	//   console.log("Connection request response:", res.data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Connection request sent successfully");
      queryClient.invalidateQueries({ queryKey: ["connectionStatus", user._id] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });
  

  // accept request
  const { mutate: acceptRequest } = useMutation({
    mutationFn: async (requestId) => {
      const res = await axiosInstance.put(`/connection/accept/${requestId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Request accepted");
      queryClient.invalidateQueries({ queryKey: ["connectionStatus", user._id] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });
  
  // reject request 
  const { mutate: rejectRequest } = useMutation({
    mutationFn: async (requestId) => {
      const res = await axiosInstance.put(`/connection/reject/${requestId}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Request rejected");
      queryClient.invalidateQueries({ queryKey: ["connectionStatus", user._id] });
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || "Something went wrong");
    },
  });
  
 
	const renderButton = () => {
		if (isLoading) {
			return (
				<button className='px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-500' disabled>
					Loading...
				</button>
			);
		}

		switch (connectionStatus?.status) {
			case "pending":
				return (
					<button
						className='px-3 py-1 rounded-full text-sm bg-yellow-500 text-white flex items-center'
						disabled
					>
						<Clock size={16} className='mr-1' />
						Pending
					</button>
				);
			case "received":
				return (
					<div className='flex gap-2 justify-center'>
						<button
							onClick={() => acceptRequest(connectionStatus.requestId)}
							className={`rounded-full p-1 flex items-center justify-center cursor-pointer bg-green-500 hover:bg-green-600 text-white`}
						>
							<Check size={16} />
						</button>
						<button
							onClick={() => rejectRequest(connectionStatus.requestId)}
							className={`rounded-full p-1 flex items-center justify-center cursor-pointer bg-red-500 hover:bg-red-600 text-white`}
						>
							<X size={16} />
						</button>
					</div>
				);
			case "connected":
				return (
					<button
						className='px-3 py-1 rounded-full text-sm bg-green-500 text-white flex items-center'
						disabled
					>
						<UserCheck size={16} className='mr-1' />
						Connected
					</button>
				);
			default:
				return (
					<button
						className='px-3 py-1 rounded-full text-sm border border-primary text-primary cursor-pointer transition-colors duration-200 flex items-center'
						onClick={handleConnect}
					>
						<UserPlus size={16} className='mr-1' />
						Connect
					</button>
				);
		}
	};

	const handleConnect = () => {
		if (connectionStatus?.status === "not connected") {
			sendConnectionRequest(user._id);
		}
    console.log("Connection status:", connectionStatus);

	};

	return (
		<div className='flex items-center justify-between mb-4'>
			<Link to={`/profile/${user.username}`} className='flex items-center flex-grow'>
				<img
					src={user.profilePicture || "/avatar.png"}
					alt={user.name}
					className='w-12 h-12 rounded-full mr-3'
				/>
				<div>
					<h3 className='font-semibold text-sm'>{user.name}</h3>
					<p className='text-xs text-info'>{user.headline}</p>
				</div>
			</Link>
			{renderButton()}
		</div>
	);
};
