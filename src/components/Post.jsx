import React, { useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Bookmark, BookMarked, Heart, MessageCircle, MoreHorizontal, SendIcon } from 'lucide-react'
import { Button } from './ui/button'
import PostDialog from './PostDialog'
import HelpDialog from './HelpDialog'
import { toast } from 'sonner'
import { useSelector } from 'react-redux'
const Post = ({post}) => {
    const [commenttext, setCommenttext] = useState('')
    const [OpenPostDialog, setOpenPostDialog] = useState(false)
    const [curLikes, setCurLikes] = useState(post.likes?.length);
    const { user } = useSelector(store => store.auth);
    const [isLiked, setIsLiked] = useState(post.likes?.includes(user?.id));
    const [doubleClick,setdoubleClick] = useState(false);
    let lastclick = 0;

    const handleNewComment = async () => {
        try{
            const response = await fetch(`http://localhost:8000/api/v1/post/${post._id}/newcomment`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({comment: commenttext})
            });
            const data = await response.json();
            if(data.success) {
                console.log(data);
                toast.success('Comment posted successfully');
                setCommenttext('');
            }
            else {
                toast.error(data.message);
            }
        }
        catch(error) {
            console.error(error);
            toast.error('Failed to post comment');
        }
    }
    const handleDoubleClick = () => {
        const now = Date.now();
        console.log(now,lastclick,now-lastclick);
        if (now - lastclick < 300){
            setdoubleClick(true);
            {!isLiked && handleLike();}
            setTimeout(()=>setdoubleClick(false),1000);
        }
        lastclick = now;
    }

    const handleLike = async () => {
        console.log(post,post.id)
        try{
            const response = await fetch(`http://localhost:8000/api/v1/post/${post._id}/likeordislike`, {credentials: 'include'});
            const data = await response.json();
            if(data.success) {
                console.log(data);
                toast.success(isLiked ? "Disliked post" : "Liked post");
                setIsLiked(!isLiked);
                setCurLikes(prev=> isLiked ? prev - 1 : prev + 1);
            }
            else {
                toast.error(data.message);
            }
        }
        catch(error) {
            console.error(error);
            toast.error('Failed to like or dislike post');
        }
    }
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
            <img onClick={()=>handleDoubleClick()} src={post.image} alt="postimg" className='rounded-sm my-2 w-full h-full aspect-square object-cover' />
            {doubleClick && <Heart style={{left: "50%",top: "50%",transform: "translate(-50%, -50%)",}} size={'150px'} fill='red' className='absolute text-red-500 animate-fly-up' />}
        </div>
        <div className='flex items-center justify-between my-2'>
            <div className='flex items-center gap-3'>
                <Heart onClick={handleLike} size={'25px'} className={`cursor-pointer hover:text-gray-600 hover:bounce-once`} fill={isLiked ? 'red' : 'none'} stroke={isLiked ? 'red' : 'currentColor'} />
                <MessageCircle onClick={()=>setOpenPostDialog(true)} size={'25px'} className='cursor-pointer hover:text-gray-600'/>
                <SendIcon size={'23px'} className='cursor-pointer hover:text-gray-600' />
            </div>
            <Bookmark size={'25px'} className='cursor-pointer hover:text-gray-600'/>
        </div>
        <span className='font-medium block '>{curLikes} likes</span>
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
            {commenttext && <Button onClick={()=>handleNewComment()} className="bg-transparent text-blue-400 hover:bg-[rgba(255,255,255,0.1)]">Post</Button>}
        </div>
    </div>
  )
}

export default Post