import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import HelpDialog from './HelpDialog'
import { Button } from './ui/button'
import { Bookmark, Heart, MessageCircle, SendIcon } from 'lucide-react'

//This function is created by chaptgpt not me, return x days ago for a post
const timeAgo = (dateString) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now - past;
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffMinutes > 0) return `${diffMinutes} minute${diffMinutes > 1 ? "s" : ""} ago`;
    return `Just now`;
}

const PostDialog = ({post}) => {
    const [commenttext, setCommenttext] = useState('')
    return (
    <div className='flex flex-1'>
        <div className='rounded-lg w-full h-full aspect-square object-cover'>
            <img src={post.image} alt="postimg" className='rounded-l-lg w-full h-full object-cover' />
        </div>
        <div className='w-3/5 flex flex-col justify-between'>
            <div className='flex items-center justify-between p-4'>
                <div className='flex items-center gap-3'>
                    <Avatar>
                        <AvatarImage src={post.author?.profilePic} alt="postimg" className='object-cover rounded-lg aspect-square' />
                        <AvatarFallback>Post</AvatarFallback>
                    </Avatar>
                    <h1>{post.author?.username}</h1>
                </div>
                <HelpDialog />
            </div>
            <hr/>
            <div className='flex-1 overflow-y-auto p-4'>
                comments
            </div>
            <hr />
            <div className='flex items-center justify-between my-2 px-3'>
                <div className='flex items-center gap-5'>
                    <Heart size={'25px'} className='cursor-pointer hover:text-gray-600 hover:bounce-once'/>
                    <MessageCircle size={'25px'} className='cursor-pointer hover:text-gray-600 hover:bounce-once'/>
                    <SendIcon size={'23px'} className='cursor-pointer hover:text-gray-600 hover:bounce-once' />
                </div>
                <Bookmark size={'25px'} className='cursor-pointer hover:text-gray-600 hover:bounce-once'/>
            </div>
            <span className='font-medium block mb-2 px-3'>{post.likes?.length} likes</span>
            <span className='text-sm block mb-2 px-3'>{timeAgo(post.createdAt)}</span>
            <hr/>
            <div className='flex items-center'>
                <input type="text" placeholder="Add a comment..." className='w-full p-3 rounded-md h-10 focus:outline-none focus:ring-0' value={commenttext} onChange={(e)=>{e.target.value.trim() ? setCommenttext(e.target.value) : setCommenttext("")}} />
                <Button disabled={!commenttext} className="bg-transparent text-blue-400 hover:bg-[rgba(255,255,255,0.1)]">Post</Button>
            </div>
        </div>
    </div>
  )
}

export default PostDialog