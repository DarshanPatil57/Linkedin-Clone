// import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
// import React from 'react'
// import { axiosInstance } from '../lib/axios'
// import toast from 'react-hot-toast'
// import { ExternalLink, Eye, MessageCircle, ThumbsUp, Trash2, UserPlus } from 'lucide-react'
// import Sidebar from '../components/Sidebar'

// export const NotificationPage = () => {

//     const {data:authUser} = useQuery({queryKey:["authUser"]})

//     const queryClient = useQueryClient()

//     const {data:notifications,isLoading} = useQuery({
//         queryKey:["notifications"],
//         queryFn: async ()=>{
//             const res = await axiosInstance.get('/notification')
//             return res.data
//         }
//     })

//     const {mutate:readNotificationMutation} = useMutation({
//         mutationFn: async (id)=>{
//             const res = await axiosInstance.put(`/notification/${id}/read`);
//             return res.data;
//         },
//         onSuccess: () => {
//             queryClient.invalidateQueries({ queryKey: ["notifications",id] });
//           },
//           onError: (err) => {
//             toast.error(err?.response?.data?.message || "Something went wrong");
//           },
//     })

//     const {mutate:deleteNotificationMutation} = useMutation({
//         mutationFn: async (id)=>{
//             const res = await axiosInstance.delete(`/notification/${id}`);
//             return res.data;
//         },
//         onSuccess: () => {
//             toast.success("Notification deleted")
//             queryClient.invalidateQueries({ queryKey: ["notifications"] });
//           },
//           onError: (err) => {
//             toast.error(err?.response?.data?.message || "Something went wrong");
//           },
//     })

//     const renderNotificationIcon = (type)=>{
//         switch  (type){
//             case "like":
//                 return <ThumbsUp className='text-blue-500'    /> 
//             case "comment":
//                 return <MessageCircle className=' text-green-500'/>
//             case "connectionAccepted":
//                 return <UserPlus className='text-purple-500'/>
//             default:
//                 return null
//         }
//     }

//     const renderNotificationContent = (notification) => {
// 		switch (notification.type) {
// 			case "like":
// 				return (
// 					<span>
// 						<strong>{notification.relatedUser.name}</strong> liked your post
// 					</span>
// 				);
// 			case "comment":
// 				return (
// 					<span>
// 						<Link to={`/profile/${notification.relatedUser.username}`} className='font-bold'>
// 							{notification.relatedUser.name}
// 						</Link>{" "}
// 						commented on your post
// 					</span>
// 				);
// 			case "connectionAccepted":
// 				return (
// 					<span>
// 						<Link to={`/profile/${notification.relatedUser.username}`} className='font-bold'>
// 							{notification.relatedUser.name}
// 						</Link>{" "}
// 						accepted your connection request
// 					</span>
// 				);
// 			default:
// 				return null;
// 		}
// 	};

//     const renderRelatedPost = (relatedPost) => {
// 		if (!relatedPost) return null;

// 		return (
// 			<Link
// 				to={`/post/${relatedPost._id}`}
// 				className='mt-2 p-2 bg-gray-50 rounded-md flex items-center space-x-2 hover:bg-gray-100 transition-colors'
// 			>
// 				{relatedPost.image && (
// 					<img src={relatedPost.image} alt='Post preview' className='w-10 h-10 object-cover rounded' />
// 				)}
// 				<div className='flex-1 overflow-hidden'>
// 					<p className='text-sm text-gray-600 truncate'>{relatedPost.content}</p>
// 				</div>
// 				<ExternalLink size={14} className='text-gray-400' />
// 			</Link>
// 		);
// 	};

//     const getRelativeTime = (dateString) => {
//         const now = new Date();
//         const commentDate = new Date(dateString);
//         const diff = Math.floor((now - commentDate) / 1000); // in seconds
      
//         if (diff < 60) return `${diff} sec ago`;
//         if (diff < 3600) return `${Math.floor(diff / 60)} min ago`;
//         if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`;
//         if (diff < 604800) return `${Math.floor(diff / 86400)} day ago`;
      
//         return commentDate.toLocaleDateString(); // fallback for older dates
//       };

//     return (
// 		<div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
// 			<div className='col-span-1 lg:col-span-1'>
// 				<Sidebar user={authUser} />
// 			</div>
// 			<div className='col-span-1 lg:col-span-3'>
// 				<div className='bg-white rounded-lg shadow p-6'>
// 					<h1 className='text-2xl font-bold mb-6'>Notifications</h1>

// 					{isLoading ? (
// 						<p>Loading notifications...</p>
// 					) : notifications && notifications.length > 0 ? (
// 						<ul>
// 							{notifications.data.map((notification) => (
// 								<li
// 									key={notification._id}
// 									className={`bg-white border rounded-lg p-4 my-4 transition-all hover:shadow-md ${
// 										!notification.read ? "border-blue-500" : "border-gray-200"
// 									}`}
// 								>
// 									<div className='flex items-start justify-between'>
// 										<div className='flex items-center space-x-4'>
// 											<Link to={`/profile/${notification.relatedUser.username}`}>
// 												<img
// 													src={notification.relatedUser.profilePicture || "/avatar.png"}
// 													alt={notification.relatedUser.name}
// 													className='w-12 h-12 rounded-full object-cover'
// 												/>
// 											</Link>

// 											<div>
// 												<div className='flex items-center gap-2'>
// 													<div className='p-1 bg-gray-100 rounded-full'>
// 														{renderNotificationIcon(notification.type)}
// 													</div>
// 													<p className='text-sm'>{renderNotificationContent(notification)}</p>
// 												</div>
// 												<p className='text-xs text-gray-500 mt-1'>
// 													{getRelativeTime(notification.createdAt)}
// 												</p>
// 												{renderRelatedPost(notification.relatedPost)}
// 											</div>
// 										</div>

// 										<div className='flex gap-2'>
// 											{!notification.read && (
// 												<button
// 													onClick={() => readNotificationMutation(notification._id)}
// 													className='p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors'
// 													aria-label='Mark as read'
// 												>
// 													<Eye size={16} />
// 												</button>
// 											)}

// 											<button
// 												onClick={() => deleteNotificationMutation(notification._id)}
// 												className='p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors'
// 												aria-label='Delete notification'
// 											>
// 												<Trash2 size={16} />
// 											</button>
// 										</div>
// 									</div>
// 								</li>
// 							))}
// 						</ul>
// 					) : (
// 						<p>No notification at the moment.</p>
// 					)}
// 				</div>
// 			</div>
// 		</div>
// 	);
// }


import React from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import {
  ExternalLink,
  Eye,
  MessageCircle,
  ThumbsUp,
  Trash2,
  UserPlus,
} from 'lucide-react'
import Sidebar from '../components/Sidebar'

export const NotificationPage = () => {
  const queryClient = useQueryClient()

  const { data: authUser } = useQuery({
    queryKey: ['authUser'],
  })

  const {
    data: notifications,
    isLoading,
  } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await axiosInstance.get('/notification')
      return res.data
    },
  })

  const { mutate: readNotificationMutation } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.put(`/notification/${id}/read`)
      return res.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Something went wrong')
    },
  })

  const { mutate: deleteNotificationMutation } = useMutation({
    mutationFn: async (id) => {
      const res = await axiosInstance.delete(`/notification/${id}`)
      return res.data
    },
    onSuccess: () => {
      toast.success('Notification deleted')
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Something went wrong')
    },
  })

  const renderNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <ThumbsUp className='text-blue-500' />
      case 'comment':
        return <MessageCircle className='text-green-500' />
      case 'connectionAccepted':
        return <UserPlus className='text-purple-500' />
      default:
        return null
    }
  }

  const renderNotificationContent = (notification) => {
    switch (notification.type) {
      case 'like':
        return (
          <span>
            <Link to={`/profile/${notification.relatedUser.username}`}
            >
            <strong>{notification.relatedUser.name}</strong>
            </Link>{' '}
            liked your post
          </span>
        )
      case 'comment':
        return (
          <span>
            <Link
              to={`/profile/${notification.relatedUser.username}`}
              className='font-bold'
            >
              {notification.relatedUser.name}
            </Link>{' '}
            commented on your post
          </span>
        )
      case 'connectionAccepted':
        return (
          <span>
            <Link
              to={`/profile/${notification.relatedUser.username}`}
              className='font-bold'
            >
              {notification.relatedUser.name}
            </Link>{' '}
            accepted your connection request
          </span>
        )
      default:
        return null
    }
  }

  const renderRelatedPost = (relatedPost) => {
    if (!relatedPost) return null

    return (
      <Link
        to={`/post/${relatedPost._id}`}
        className='mt-2 p-2 bg-gray-50 rounded-md flex items-center space-x-2 hover:bg-gray-100 transition-colors'
      >
        {relatedPost.image && (
          <img
            src={relatedPost.image}
            alt='Post preview'
            className='w-10 h-10 object-cover rounded'
          />
        )}
        <div className='flex-1 overflow-hidden'>
          <p className='text-sm text-gray-600 truncate'>{relatedPost.content}</p>
        </div>
        <ExternalLink size={14} className='text-gray-400' />
      </Link>
    )
  }

  const getRelativeTime = (dateString) => {
    const now = new Date()
    const date = new Date(dateString)
    const diff = Math.floor((now - date) / 1000)

    if (diff < 60) return `${diff} sec ago`
    if (diff < 3600) return `${Math.floor(diff / 60)} min ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hr ago`
    if (diff < 604800) return `${Math.floor(diff / 86400)} day ago`

    return date.toLocaleDateString()
  }

  return (
    <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
      <div className='col-span-1'>
        <Sidebar user={authUser} />
      </div>
      <div className='col-span-1 lg:col-span-3'>
        <div className='bg-white rounded-lg shadow p-6'>
          <h1 className='text-2xl font-bold mb-6'>Notifications</h1>

          {isLoading ? (
            <p>Loading notifications...</p>
          ) : notifications && notifications.length > 0 ? (
            <ul>
              {notifications.map((notification) => (
                <li
                  key={notification._id}
                  className={`bg-white border rounded-lg p-4 my-4 transition-all hover:shadow-md ${
                    !notification.read ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex items-center space-x-4'>
                      <Link to={`/profile/${notification.relatedUser.username}`}>
                        <img
                          src={
                            notification.relatedUser.profilePicture || '/avatar.png'
                          }
                          alt={notification.relatedUser.name}
                          className='w-12 h-12 rounded-full object-cover'
                        />
                      </Link>

                      <div>
                        <div className='flex items-center gap-2'>
                          <div className='p-1 bg-gray-100 rounded-full'>
                            {renderNotificationIcon(notification.type)}
                          </div>
                          <p className='text-sm'>
                            {renderNotificationContent(notification)}
                          </p>
                        </div>
                        <p className='text-xs text-gray-500 mt-1'>
                          {getRelativeTime(notification.createdAt)}
                        </p>
                        {renderRelatedPost(notification.relatedPost)}
                      </div>
                    </div>

                    <div className='flex gap-2'>
                      {!notification.read && (
                        <button
                          onClick={() =>
                            readNotificationMutation(notification._id)
                          }
                          className='p-1 cursor-pointer  bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors'
                          aria-label='Mark as read'
                        >
                          <Eye size={16} />
                        </button>
                      )}

                      <button
                        onClick={() => deleteNotificationMutation(notification._id)}
                        className='p-1 cursor-pointer bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors'
                        aria-label='Delete notification'
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications at the moment.</p>
          )}
        </div>
      </div>
    </div>
  )
}
