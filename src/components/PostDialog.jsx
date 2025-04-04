import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import HelpDialog from './HelpDialog'
import { Button } from './ui/button'
import { Bookmark, Heart, MessageCircle, SendIcon } from 'lucide-react'
import { handleLike, handleDoubleClick,handleNewComment } from './Post'
import { useDispatch, useSelector } from 'react-redux'
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
    const [commenttext, setCommenttext] = useState('');
    const [curLikes, setCurLikes] = useState(post.likes?.length);
    const { user } = useSelector(store => store.auth);
    const [isLiked, setIsLiked] = useState(post.likes?.includes(user?.id));
    const [doubleClick,setdoubleClick] = useState(false);
    const {posts} = useSelector(store => store.posts);
    const [comments, setComments] = useState(post.comments);
    const dispatch = useDispatch();
    const [lastclick, setlastclick] = useState(0);

    useEffect(() => {
        const fetchComments = async () => {
          try {
            const response = await fetch(`http://localhost:8000/api/v1/post/${post._id}/allcomments`, {
              method: 'GET',
              credentials: 'include',
            });
            const data = await response.json();
            setComments(data.comments.comments);
          } catch (error) {
            console.error(error);
          }
        };
        fetchComments();
    }, [post]);

    return (
    <div className='flex flex-1'>
        <div className='relative rounded-lg w-full h-full aspect-square object-cover'>
            <img onClick={()=>handleDoubleClick(user,post,posts,isLiked,setIsLiked,setCurLikes,dispatch,setdoubleClick,lastclick,setlastclick,handleLike)} src={post.image} alt="postimg" className='rounded-l-lg w-full h-full object-cover' />
            {doubleClick && <Heart style={{left: "50%",top: "50%",transform: "translate(-50%, -50%)",}} size={'150px'} fill='red' className='absolute text-red-500 animate-fly-up' />}
        </div>
        <div className='min-w-[40%] max-w-[40%] flex flex-col justify-between'>
            <div className='flex items-center justify-between p-4'>
                <div className='flex items-center gap-3'>
                    <Avatar>
                        <AvatarImage src={post.author?.profilePic} alt="postimg" className='object-cover rounded-lg aspect-square' />
                        <AvatarFallback>Post</AvatarFallback>
                    </Avatar>
                    <h1>{post.author?.username}</h1>
                </div>
                <HelpDialog post={post} />
            </div>
            <hr/>
            <div className='h-100 overflow-y-auto p-4 custom-scrollbar'>
                {comments.map((comment, index) => (
                    <div className='flex grow items-center justify-between p-4'>
                        <div className='w-full flex flex-col items-start gap-3'>
                            <div className='flex gap-3 justify-between'>
                                <Avatar>
                                    <AvatarImage src={comment.profilePic} alt="postimg" className='object-cover rounded-lg aspect-square' />
                                    <AvatarFallback>Post</AvatarFallback>
                                </Avatar>
                                <h1 className='font-semibold'>{comment.username}</h1>
                            </div>
                            <p className='font-normal break-words whitespace-pre-wrap overflow-hidden'>{comment.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
            <hr />
            <div className='flex items-center justify-between my-2 px-3'>
                <div className='flex items-center gap-5'>
                    <Heart onClick={()=>handleLike(user,post,posts,isLiked,setIsLiked,setCurLikes,dispatch)} size={'25px'} className={`cursor-pointer hover:text-gray-600 hover:bounce-once`} fill={isLiked ? 'red' : 'none'} stroke={isLiked ? 'red' : 'currentColor'} />
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
                <Button onClick={()=>handleNewComment(post,posts,comments,setComments,commenttext,setCommenttext,dispatch)} disabled={!commenttext} className="bg-transparent text-blue-400 hover:bg-[rgba(255,255,255,0.1)]">Post</Button>
            </div>
        </div>
    </div>
  )
}

export default PostDialog