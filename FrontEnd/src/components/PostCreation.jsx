import { useMutation, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Image, Loader } from "lucide-react";

export const PostCreation = ({user}) => {
  const [content, setContent] = useState();
  const [image, setImage] = useState();
  const [imagePreview, setImagePreview] = useState();

  const queryClient = useQueryClient()

  const { mutate: createPost, isPending } = useMutation({
    mutationFn: async (postdata) => {
      const res = await axiosInstance.post("/posts/create", postdata,{
        headers:{"Content-Type":"application/json"}
      });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Post created successfully");
      resetForm()
      queryClient.invalidateQueries({queryKey:["posts"]})
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Something went wrong");
    },
  });

  const handlePostCreation = async ()=>{
    try {
        const postData = {content}
        if(image) postData.image = await readFileAsDataURL(image)

        createPost(postData)
    } catch (error) {
        console.error("Error in handle post creation" ,error);
        toast.error( "Please add some content to create a post ");
        
    }
  }

  const resetForm = ()=>{
    setContent("")
    setImage("")
    setImagePreview("")
  }

  const handleImageChange = (e) =>{
    const file = e.target.files[0]
    setImage(file)

    if(file){
        readFileAsDataURL(file).then(setImagePreview)
    }else{
        setImagePreview(null)
    }
  }

//   read file
  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};
return (
    <div className='bg-secondary rounded-lg shadow mb-4 p-4'>
        <div className='flex space-x-3'>
            <img src={user.profilePicture || "/avatar.png"} alt={user.name} className='size-12 rounded-full' />
            <textarea
                placeholder="What's on your mind?"
                className='w-full p-3 rounded-lg bg-gray-100 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none resize-none transition-colors duration-200 min-h-[150px]'
                value={content}
                onChange={(e) => setContent(e.target.value)}
            />
        </div>

        {imagePreview && (
            <div className='mt-4'>
                <img src={imagePreview} alt='Selected' className='w-full h-auto rounded-lg' />
            </div>
        )}

        <div className='flex justify-between items-center mt-4'>
            <div className='flex space-x-4'>
                <label className='flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer'>
                    <Image size={20} className='mr-2' />
                    <span>Photo</span>
                    <input type='file' accept='image/*' className='hidden' onChange={handleImageChange} />
                </label>
            </div>

            <button
                className='bg-blue-500 cursor-pointer text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors duration-200'
                onClick={handlePostCreation}
                disabled={isPending}
            >
                {isPending ? <Loader className='size-5 animate-spin' /> : "Share"}
            </button>
        </div>
    </div>
);
};
