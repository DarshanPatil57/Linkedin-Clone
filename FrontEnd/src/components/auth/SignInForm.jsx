import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { useState } from 'react'
import { axiosInstance } from '../../lib/axios'
import toast from 'react-hot-toast'
import { Loader } from 'lucide-react'

export const SignInForm = () => {

  const [username,setUsername] = useState()
  const [password,setPassword] = useState()

  const queryClient = useQueryClient()

  const {mutate:signInMutation,isPending} = useMutation({

    mutationFn:async(data)=>{
      const res = await axiosInstance.post("/auth/signin",data)
      return res.data
    },
    onSuccess:()=>{
        toast.success("SignIn successfully")
        queryClient.invalidateQueries({queryKey:["authUser"]})
    },
    onError:(err)=>{
        toast.error(err.response.data.message || "Something went wrong")
    }
  })

  const handleSignin = (e)=>{
    e.preventDefault()
    signInMutation({username,password})
  }

  return (
    <div>
      <form onSubmit={handleSignin} action="" className='flex flex-col gap-4'>
      <div>
            <input type="text"
            placeholder='Username'
            value={username}
            onChange={(e)=> setUsername(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary'
            required
            />
        </div>
        <div>
            <input type="password"
            placeholder='Password'
            value={password}
            onChange={(e)=> setPassword(e.target.value)}
            className='w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-primary'
            required
            />
        </div>

        <button type='submit' disabled={isPending}  className='w-full shadow-sm px-4 py-2 text-white rounded-md  bg-blue-600 cursor-pointer '>
		{isPending ? <Loader className="sizw-5 animate-spin flex items-center text-center"/> : "Sign In"}
		</button>
      </form>
    </div>
  )
}
