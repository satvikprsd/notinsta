import React, { useState } from 'react'
import testimg from './testpost.jpg'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import HelpDialog from './HelpDialog'
import { Button } from './ui/button'
import { Bookmark, Heart, MessageCircle, SendIcon } from 'lucide-react'

const PostDialog = () => {
    const [commenttext, setCommenttext] = useState('')
    return (
    <div className='flex flex-1'>
        <div className='w-3/5'>
            <img src={testimg} alt="postimg" className='rounded-l-lg w-full h-full object-cover' />
        </div>
        <div className='w-2/5 flex flex-col justify-between'>
            <div className='flex items-center justify-between p-4'>
                <div className='flex items-center gap-3'>
                    <Avatar>
                        <AvatarImage src="https://github.com/shadcn.png" alt="postimg" />
                        <AvatarFallback>Post</AvatarFallback>
                    </Avatar>
                    <h1>Username</h1>
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
            <span className='font-medium block mb-2 px-3'>1,234 likes</span>
            <span className='text-sm block mb-2 px-3'>1 day ago</span>
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