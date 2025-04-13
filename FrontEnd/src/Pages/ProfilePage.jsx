import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { useParams } from 'react-router-dom'
import { axiosInstance } from '../lib/axios'
import toast from 'react-hot-toast'
import { ProfileHeader } from '../components/ProfileHeader'

import  ExperienceSection  from '../components/ExperienceSection'
import  EducationSection  from '../components/EducationSection'
import  SkillsSection  from '../components/SkillsSection'
import AboutSection from '../components/AboutSection'

export const ProfilePage = () => {
    const {username} = useParams()
    const queryClient = useQueryClient()

    const {data:authUser , isLoading} = useQuery({
        queryKey:["authUser"]
    })

    // get profile
    const {data:userProfile, isLoading:isUserProfileLoading} = useQuery({
        queryKey:["userProfile", username],
        queryFn: async ()=>{
            const res = await axiosInstance.get(`/users/${username}`)
            return res.data
        }
    })

    // update profile
    const {mutate:updateProfile} = useMutation({
        mutationFn: async (updatedData) =>{
            const res = await axiosInstance.put("/users/profile", updatedData)
            return res.data
        },
        onSuccess:() => {
            toast.success("Profile updated")
            queryClient.invalidateQueries(["userProfile", username])
          },
          onError: (err) => {
            toast.error(err?.response?.data?.message || 'Something went wrong')
          },
    })

    if(isLoading || isUserProfileLoading) return null

    const isOwnProfile = authUser.username === userProfile.username;
    const userData = isOwnProfile ? authUser : userProfile

    const handleSave = (updatedData)=>{
        updateProfile(updatedData)
    }

  return (
    <div className='max-w-4xl mx-auto p-4'>
        <ProfileHeader userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave}/>
        <AboutSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave}/>
        <ExperienceSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave}/>
        <EducationSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave}/>
        <SkillsSection userData={userData} isOwnProfile={isOwnProfile} onSave={handleSave}/>
    </div>
  )
}
