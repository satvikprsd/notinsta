import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Bookmark, BookMarked, Heart, MessageCircle, MoreHorizontal, SendIcon } from 'lucide-react'
import { Button } from './ui/button'
import PostDialog from './PostDialog'
import HelpDialog from './HelpDialog'
const Post = ({post}) => {
    const [commenttext, setCommenttext] = useState('')
    const [OpenPostDialog, setOpenPostDialog] = useState(false)

    return (
    <div className='my-8 w-full max-w-lg mx-auto'>
        <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
                <Avatar>
                    <AvatarImage src={post.author?.profilePic} alt="postimg" className='object-cover rounded-lg aspect-square' />
                    <AvatarFallback>Post</AvatarFallback>
                </Avatar>
                <h1>{post.author?.username}</h1>
            </div>
            <HelpDialog />
        </div>
        <img src={post.image} alt="postimg" className='rounded-sm my-2 w-full h-full aspect-square object-cover' />
        <div className='flex items-center justify-between my-2'>
            <div className='flex items-center gap-3'>
                <Heart size={'25px'} className='cursor-pointer hover:text-gray-600 hover:bounce-once'/>
                <MessageCircle onClick={()=>setOpenPostDialog(true)} size={'25px'} className='cursor-pointer hover:text-gray-600 hover:bounce-once'/>
                <SendIcon size={'23px'} className='cursor-pointer hover:text-gray-600 hover:bounce-once' />
            </div>
            <Bookmark size={'25px'} className='cursor-pointer hover:text-gray-600 hover:bounce-once'/>
        </div>
        <span className='font-medium block '>{post.likes?.length} likes</span>
        <span className='font-medium mb-2'>{post.author?.username} </span>
        <span className='font-light mb-2'>{post.caption}</span>
        <span onClick={()=>setOpenPostDialog(true)} className='font-light block mb-2 hover:cursor-pointer'>View all 42 comments</span>
        <Dialog open={OpenPostDialog}>
            <DialogContent className='max-w-5xl p-0 flex flex-col focus:outline-none focus:ring-0' onInteractOutside={()=>setOpenPostDialog(false)}>
                <PostDialog post={post}/>
            </DialogContent>
        </Dialog>
        <div className='flex items-center'>
            <input type="text" placeholder="Add a comment..." className='w-full p-3 rounded-md h-10 focus:outline-none focus:ring-0' value={commenttext} onChange={(e)=>{e.target.value.trim() ? setCommenttext(e.target.value) : setCommenttext("")}} />
            {commenttext && <Button className="bg-transparent text-blue-400 hover:bg-[rgba(255,255,255,0.1)]">Post</Button>}
        </div>
    </div>
  )
}

export default Post