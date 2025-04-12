
import { Navigate, Route, Routes } from 'react-router-dom'
import './App.css'
import { Layout } from './components/Layout'
import { HomePage } from './Pages/HomePage'
import { Signup } from './Pages/Signup'
import { Signin } from './Pages/Signin'
import toast, { Toaster } from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { axiosInstance } from './lib/axios'
import { NotificationPage } from './Pages/NotificationPage'
import { NetworkPage } from './Pages/NetworkPage'
import PostPage from './Pages/PostPage'

function App() {
  const {data:authUser,isLoading} = useQuery({
    queryKey:['authUser'],
    queryFn: async()=>{
      try {
        const res = await axiosInstance.get("/auth/me")
        return res.data
      } catch (error) {
        if(error.response && error.response.status === 401){
          return null
        }        
        toast.error(error.response.data.message || "Something went wrong")
      }
    }
  })
  // console.log(authUser);
  if(isLoading) return null
    
  return (
   <Layout>
    <Routes>
      <Route path='/' element={ authUser ? <HomePage/> : <Navigate to={"/signin"}/>}/>
      <Route path='/signup' element={!authUser ? <Signup/> : <Navigate to={"/"}/>}/>
      <Route path='/signin' element={!authUser ?  <Signin/> : <Navigate to={"/"}/>}/>
      <Route path='/notification' element={authUser ?  <NotificationPage/> : <Navigate to={"/signin"}/>}/>
      <Route path='/network' element={authUser ?  <NetworkPage/> : <Navigate to={"/signin"}/>}/>
      <Route path='/post/:postId' element={authUser ?  <PostPage/> : <Navigate to={"/signin"}/>}/>
    </Routes>
    <Toaster/>
   </Layout>
  )
}

export default App
