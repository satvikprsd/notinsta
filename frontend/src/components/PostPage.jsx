import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import PostDialog from './PostDialog';
import NotextLogo from "./notinstalogo.png";
import { useLoading } from "./LoadingContext";
import MobileComment from './MobileComment';
import { Dialog } from './ui/dialog';
import { DialogContent } from '@radix-ui/react-dialog';

const PostPage = () => {
    const params = useParams();
    const postID = params.postid;
    const [post, setPost] = useState(null);
    const [loading, setLoading ] = useState(true);
    useEffect(()=>{
        const fetchPost = async () => {
            try{
                setLoading(true);
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/post/getpost/${postID}`);
                const data = await response.json();
                if(data.success){
                    setPost(data.post) 
                }
                else{
                    setPost('Not Found')
                }
            }
            catch(e){
                console.log(e);
            }
            finally{
                setLoading(false);
            }
        }
        fetchPost();
    }, [])

    if(!post || loading){
        return (
            <div className="min-h-screen flex-1 my-3 flex flex-col justify-center items-center sm:pl-[20%]">
                        <img src={NotextLogo} alt="Description" width="100" className="block my-8 pl-3"/>
            </div>
        )
    }
    else if(post == 'Not Found'){
        return (
            <div className="min-h-screen flex-1 my-3 flex flex-col justify-center items-center sm:pl-[20%]">
                <h1>Post not found</h1>
            </div>
        )
    }
    
    return (
    <div className='h-full w-full flex items-center justify-center pl-0 md:pl-[85px]'>
        <div className='flex'>
            <PostDialog post={post} />
        </div>
    </div>
    )
}

export default PostPage