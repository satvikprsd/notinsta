import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Bookmark, BookMarked, Heart, MessageCircle, MoreHorizontal, SendIcon } from 'lucide-react'
import { Button } from './ui/button'
import PostDialog from './PostDialog'
import HelpDialog from './HelpDialog'
import { useDispatch, useSelector } from 'react-redux'
import { handleDoubleClick, handleLike, handleNewComment } from './PostHandler'

const Post = ({post}) => {
    const [commenttext, setCommenttext] = useState('')
    const [OpenPostDialog, setOpenPostDialog] = useState(false)
    const [curLikes, setCurLikes] = useState(post.likes?.length);
    const [curComments, setCurComments] = useState(post.comments?.length);
    const { user } = useSelector(store => store.auth);
    const [isLiked, setIsLiked] = useState(post.likes?.includes(user?.id));
    const [doubleClick,setdoubleClick] = useState(false);
    const { feed } = useSelector(store => store.posts);
    const [comments, setComments] = useState(post.comments);
    const [lastclick, setlastclick] = useState(0);
    const dispatch = useDispatch();
    
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
            <HelpDialog post={post} />
        </div>
        <div className='relative w-full h-full'>
            <img onClick={()=>handleDoubleClick(user,post,feed,isLiked,setIsLiked,setCurLikes,dispatch,setdoubleClick,lastclick,setlastclick,handleLike)} src={post.image} alt="postimg" className='rounded-sm my-2 w-full h-full aspect-square object-cover' />
            {doubleClick && <Heart style={{left: "50%",top: "50%",transform: "translate(-50%, -50%)",}} size={'150px'} fill='red' className='absolute text-red-500 animate-fly-up' />}
        </div>
        <div className='flex items-center justify-between my-2'>
            <div className='flex items-center gap-3'>
                <Heart onClick={()=>handleLike(user,post,feed,isLiked,setIsLiked,setCurLikes,dispatch)} size={'25px'} className={`cursor-pointer hover:text-gray-600 hover:bounce-once`} fill={isLiked ? 'red' : 'none'} stroke={isLiked ? 'red' : 'currentColor'} />
                <MessageCircle onClick={()=>setOpenPostDialog(true)} size={'25px'} className='cursor-pointer hover:text-gray-600'/>
                <SendIcon size={'23px'} className='cursor-pointer hover:text-gray-600' />
            </div>
            <Bookmark size={'25px'} className='cursor-pointer hover:text-gray-600'/>
        </div>
        <span className='font-medium block '>{curLikes} likes</span>
        <span className='font-medium mb-2'>{post.author?.username} </span>
        <span className='font-light mb-2'>{post.caption}</span>
        {curComments>0 && <span onClick={()=>setOpenPostDialog(true)} className='font-light block hover:cursor-pointer'>View all {curComments} comments</span>}
        <Dialog open={OpenPostDialog}>
            <DialogContent className='max-w-5xl p-0 flex flex-col focus:outline-none focus:ring-0' onInteractOutside={()=>setOpenPostDialog(false)}>
                <PostDialog  post={post}/>
            </DialogContent>
        </Dialog>
        <div className='flex items-center'>
            <input type="text" placeholder="Add a comment..." className='w-full p-3 rounded-md h-10 focus:outline-none focus:ring-0' value={commenttext} onChange={(e)=>{e.target.value.trim() ? setCommenttext(e.target.value) : setCommenttext("")}} />
            {commenttext && <Button onClick={()=>handleNewComment(post,feed,comments,setComments,commenttext,setCommenttext,dispatch,setCurComments)} className="bg-transparent text-blue-400 hover:bg-[rgba(255,255,255,0.1)]">Post</Button>}
        </div>
    </div>
  )
}

export default Post