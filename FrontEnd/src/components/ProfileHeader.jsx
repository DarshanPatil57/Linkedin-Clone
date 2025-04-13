import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React, { useMemo, useState } from 'react'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import { Camera, MapPin, UserCheck, UserPlus, X, Clock } from 'lucide-react'

export const ProfileHeader = ({ userData, onSave, isOwnProfile }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [editedData, setIEditedData] = useState({})
  const queryClient = useQueryClient()

  const { data: authUser } = useQuery({ queryKey: ["authUser"] })

  const { data: connectionStatus, refetch: refetchConnectionStatus } = useQuery({
    queryKey: ["connectionStatus", userData._id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/connection/status/${userData._id}`)
      return res.data
    },
    enabled: !isOwnProfile,
  })

  const { mutate: sendConnectionRequest } = useMutation({
    mutationFn: async (userId) => {
      const res = await axiosInstance.post(`/connection/request/${userId}`)
      return res.data
    },
    onSuccess: () => {
      toast.success("Connection request sent")
      refetchConnectionStatus()
      queryClient.invalidateQueries(["connectionRequest"])
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Something went wrong')
    }
  })

  const { mutate: acceptRequest } = useMutation({
    mutationFn: async (requestId) => {
      const res = await axiosInstance.put(`/connection/accept/${requestId}`)
      return res.data
    },
    onSuccess: () => {
      toast.success("Connection request accepted")
      refetchConnectionStatus()
      queryClient.invalidateQueries(["connectionRequest"])
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Something went wrong')
    },
  })

  const { mutate: rejectRequest } = useMutation({
    mutationFn: async (requestId) => {
      const res = await axiosInstance.put(`/connection/reject/${requestId}`)
      return res.data
    },
    onSuccess: () => {
      toast.success("Connection request rejected")
      refetchConnectionStatus()
      queryClient.invalidateQueries(["connectionRequest"])
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Something went wrong')
    },
  })

  const { mutate: removeConnection } = useMutation({
    mutationFn: async (userId) => {
      const res = await axiosInstance.delete(`/connection/${userId}`)
      return res.data
    },
    onSuccess: () => {
      toast.success("Connection removed")
      refetchConnectionStatus()
      queryClient.invalidateQueries(["connectionRequest"])
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Something went wrong')
    }
  })

  const getConnectionStatus = useMemo(() => {
    if (isOwnProfile) return null
    return connectionStatus?.status || "not_connected"
  }, [isOwnProfile, connectionStatus])

  const renderConnectionButton = () => {
    const baseClass = "text-white py-2 px-4 rounded-full transition duration-300 flex items-center justify-center"

    switch (getConnectionStatus) {
      case "connected":
        return (
          <div className='flex gap-2 justify-center'>
            <div className={`${baseClass} bg-green-500 hover:bg-green-600 cursor-pointer`}>
              <UserCheck size={20} className='mr-2' />
              Connected
            </div>
            <button
              className={`${baseClass} bg-red-500 hover:bg-red-600 text-sm cursor-pointer`}
              onClick={() => removeConnection(userData._id)}
            >
              <X size={20} className='mr-2' />
              Remove 
            </button>
          </div>
        )

      case "pending":
        return (
          <button className={`${baseClass} bg-yellow-500 hover:bg-yellow-600`}>
            <Clock size={20} className='mr-2' />
            Pending
          </button>
        )

      case "received":
        return (
          <div className='flex gap-2 justify-center'>
            <button
              onClick={() => acceptRequest(connectionStatus.requestId)}
              className={`${baseClass} bg-green-500 hover:bg-green-600 cursor-pointer`}
            >
              Accept
            </button>
            <button
              onClick={() => rejectRequest(connectionStatus.requestId)}
              className={`${baseClass} bg-red-500 hover:bg-red-600 cursor-pointer`}
            >
              Reject
            </button>
          </div>
        )

      default:
        return (
          <button
            onClick={() => sendConnectionRequest(userData._id)}
            className={`${baseClass} bg-blue-500 hover:bg-blue-600`}
          >
            <UserPlus size={20} className='mr-2' />
            Connect
          </button>
        )
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setIEditedData((prev) => ({ ...prev, [event.target.name]: reader.result }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = () => {
    onSave(editedData)
    setIsEditing(false)
  }

  return (
    <div className='bg-white shadow rounded-lg mb-6'>
      <div
        className='relative h-48 rounded-t-lg bg-cover bg-center'
        style={{
          backgroundImage: `url('${editedData.banner || userData.banner || "/banner.png"}')`,
        }}
      >
        {isEditing && (
          <label className='absolute top-2 right-2 bg-white p-2 rounded-full shadow cursor-pointer'>
            <Camera size={20} />
            <input
              type='file'
              className='hidden'
              name='banner'
              onChange={handleImageChange}
              accept='image/*'
            />
          </label>
        )}
      </div>

      <div className='p-4'>
        <div className='relative -mt-20 mb-4'>
          <img
            className='w-32 h-32 rounded-full mx-auto object-cover'
            src={editedData.profilePicture || userData.profilePicture || "/avatar.png"}
            alt={userData.name}
          />

          {isEditing && (
            <label className='absolute bottom-0 right-1/2 transform translate-x-16 bg-white p-2 rounded-full shadow cursor-pointer'>
              <Camera size={20} />
              <input
                type='file'
                className='hidden'
                name='profilePicture'
                onChange={handleImageChange}
                accept='image/*'
              />
            </label>
          )}
        </div>

        <div className='text-center mb-4'>
          {isEditing ? (
            <input
              type='text'
              value={editedData.name ?? userData.name}
              onChange={(e) => setIEditedData({ ...editedData, name: e.target.value })}
              className='text-2xl font-bold mb-2 text-center w-full'
            />
          ) : (
            <h1 className='text-2xl font-bold mb-2'>{userData.name}</h1>
          )}

          {isEditing ? (
            <input
              type='text'
              value={editedData.headline ?? userData.headline}
              onChange={(e) => setIEditedData({ ...editedData, headline: e.target.value })}
              className='text-gray-600 text-center w-full'
            />
          ) : (
            <p className='text-gray-600'>{userData.headline}</p>
          )}

          <div className='flex justify-center items-center mt-2'>
            <MapPin size={16} className='text-gray-500 mr-1' />
            {isEditing ? (
              <input
                type='text'
                value={editedData.location ?? userData.location}
                onChange={(e) => setIEditedData({ ...editedData, location: e.target.value })}
                className='text-gray-600 text-center'
              />
            ) : (
              <span className='text-gray-600'>{userData.location}</span>
            )}
          </div>
        </div>

        <div className='flex items-center justify-center'>
          {isOwnProfile ? (
            isEditing ? (
              <button
                className='w-60 bg-blue-500 cursor-pointer text-white py-2 px-4 rounded-full transition duration-300'
                onClick={handleSave}
              >
                Save Profile
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className='w-60 bg-blue-500 cursor-pointer text-white py-2 px-4 rounded-full transition duration-300'
              >
                Edit Profile
              </button>
            )
          ) : (
            <div className='flex justify-center'>{renderConnectionButton()}</div>
          )}
        </div>
      </div>
    </div>
  )
}
