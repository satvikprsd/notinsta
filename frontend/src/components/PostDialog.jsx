/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import HelpDialog from './HelpDialog'
import { Button } from './ui/button'
import { ArrowBigLeft, ArrowLeft, Bookmark, Heart, MessageCircle, SendIcon } from 'lucide-react'
import { handleLike, handleDoubleClick,handleNewComment, SavePost, LikesDialog } from './PostHandler'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { setSavedPosts } from '@/redux/authSlice'
import NotextLogo from "./notinstalogo.png";
import { Dialog, DialogContent } from './ui/dialog'
import MobileComment from './MobileComment'
import { DialogTitle } from '@radix-ui/react-dialog'

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

const PostDialog = ({setOpenPostDialog,newsetIsLiked,newisLiked,newcurLikes,newsetCurLikes,newsetCurComments,post}) => {
    
    const [commenttext, setCommenttext] = useState('');
    const { user,profile,savedPosts } = useSelector(store => store.auth);
    const [doubleClick,setdoubleClick] = useState(false);
    const { feed } = useSelector(store => store.posts);
    const [comments, setComments] = useState(post?.comments);
    const dispatch = useDispatch();
    const [lastclick, setlastclick] = useState(0);
    const [isLikedState, setIsLikedState] = useState(post?.likes.map((f)=>f._id).includes(user?._id));
    const [curLikesState, setCurLikesState] = useState(post?.likes.length || 0);
    const [curCommentsState, setCurCommentsState] = useState(post?.comments.length||0);
    const isLiked = newisLiked ?? isLikedState;
    console.log(isLiked)
    const setIsLiked = newsetIsLiked ?? setIsLikedState;
    const curLikes = newcurLikes ?? curLikesState;
    const setCurLikes = newsetCurLikes ?? setCurLikesState;
    const setCurComments = newsetCurComments ?? setCurCommentsState;
    const [isSaved, setisSaved] = useState(savedPosts?.map((post)=>post._id).includes(post?._id));
    const [islikerfollowed, setIslikerFollowed] = useState({});
    const [openlikesdialog, setOpenlikesDialog] = useState(false);
    const [mobile, setMobile] = useState(false);
    const likes = post?.likes;
    // console.log(post, "newtest");

    const getLikes = () => {
        const followingIDs = new Set(user?.following?.map(f => f._id));
        const followedStatus = {};
        likes?.forEach(f => {
          followedStatus[f._id] = followingIDs.has(f._id);
        });
        setIslikerFollowed(followedStatus);
        setOpenlikesDialog(true)
    }

    useEffect(() => {
        const fetchComments = async () => {
          try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/post/${post._id}/allcomments`, {
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
    <div className='flex flex-col flex-1 lg:flex-row '>
        <Dialog open={mobile}>
            <DialogContent className='p-0 min-w-[90vw] max-w-[90vw]' onInteractOutside={()=>setMobile(false)}>
                <div className="w-full relative flex items-center pt-4">
                    <button onClick={()=>setMobile(false)} className="absolute left-0 pl-4">
                        <ArrowLeft size='30px' />
                    </button>
                    <DialogTitle className="w-full text-center font-bold">
                        Comments
                    </DialogTitle>
                </div>
                <MobileComment post={post} setMobile={setMobile}/>
            </DialogContent>
        </Dialog>
        {user && <LikesDialog openlikesdialog={openlikesdialog} setOpenlikesDialog={setOpenlikesDialog} likes={likes} islikerfollowed={islikerfollowed} setIslikerFollowed={setIslikerFollowed} dispatch={dispatch} user={user} />}
        <div className='flex lg:hidden items-center justify-between py-4'>
            <div className='flex items-center gap-3'>
                <Link onClick={()=>setOpenPostDialog(false)}>
                    <Avatar>
                        <AvatarImage src={post?.author.profilePic=='default.jpg' ? NotextLogo : post?.author.profilePic} alt="postimg" className='object-cover rounded-lg aspect-square' />
                        <AvatarFallback>Post</AvatarFallback>
                    </Avatar>
                </Link>
                <Link onClick={()=>setOpenPostDialog(false)}>
                    <h1>{post?.author.username}</h1>
                </Link>
            </div>
            <HelpDialog isSaved={isSaved} setisSaved={setisSaved} setDialog={setOpenPostDialog} post={post} />
        </div>
        <div className='relative rounded-lg w-[300px] h-[400px] sm:w-[500px] md:h-[600px] lg:w-full lg:h-full aspect-square object-cover'>
            <img onClick={()=>handleDoubleClick(user,profile,post,feed,isLiked,setIsLiked,setCurLikes,dispatch,setdoubleClick,lastclick,setlastclick,handleLike)} src={post?.image} alt="postimg" className="rounded-lg lg:rounded-l-lg lg:rounded-tr-none lg:rounded-br-none w-full h-full object-cover"/>
            {doubleClick && <Heart style={{left: "50%",top: "50%",transform: "translate(-50%, -50%)",}} size={'150px'} fill='red' className='absolute text-red-500 animate-fly-up' />}
        </div>
        <div className='min-w-[300px] max-w-[300px] sm:min-w-[500px] sm:max-w-[500px] lg:min-w-[40%] flex flex-col justify-between'>
            <div className='hidden lg:flex items-center justify-between p-4'>
                <div className='flex items-center gap-3'>
                    <Link onClick={()=>setOpenPostDialog(false)}>
                        <Avatar>
                            <AvatarImage src={post?.author.profilePic=='default.jpg' ? NotextLogo : post?.author.profilePic} alt="postimg" className='object-cover rounded-lg aspect-square' />
                            <AvatarFallback>Post</AvatarFallback>
                        </Avatar>
                    </Link>
                    <Link onClick={()=>setOpenPostDialog(false)}>
                        <h1>{post?.author.username}</h1>
                    </Link>
                </div>
                <HelpDialog isSaved={isSaved} setisSaved={setisSaved} setDialog={setOpenPostDialog} post={post} />
            </div>
            <hr/>
            <div className='h-100 overflow-y-auto p-4 custom-scrollbar hidden lg:block'>
                {comments?.map((comment,index) => (
                    <div key={index} className='flex grow items-center justify-between p-4'>
                        <div className='w-full flex flex-col items-start gap-3'>
                            <div className='flex gap-3 justify-between'>
                                <Link onClick={()=>setOpenPostDialog(false)} to={`/profile/${comment?.author?.username}`}>
                                    <Avatar>
                                        <AvatarImage src={comment?.author.profilePic=='default.jpg' ? NotextLogo : comment?.author.profilePic} alt="postimg" className='object-cover rounded-lg aspect-square' />
                                        <AvatarFallback>Post</AvatarFallback>
                                    </Avatar>
                                </Link>
                                <Link onClick={()=>setOpenPostDialog(false)} to={`/profile/${comment?.author?.username}`}>
                                <h1 className='font-semibold'>{comment?.author?.username}</h1>
                                </Link>
                            </div>
                            <p className='font-normal break-words whitespace-pre-wrap overflow-hidden'>{comment.comment}</p>
                        </div>
                    </div>
                ))}
            </div>
            <hr />
            <div className='flex items-center justify-between my-2 px-3'>
                <div className='flex items-center gap-5'>
                    <Heart onClick={()=>handleLike(user,profile,post,feed,isLiked,setIsLiked,setCurLikes,dispatch)} size={'25px'} className={`cursor-pointer hover:text-gray-600 hover:bounce-once`} fill={isLiked ? 'red' : 'none'} stroke={isLiked ? 'red' : 'currentColor'} />
                    <MessageCircle onClick={()=> {window.innerWidth <= 1024 ? setMobile(true) : setMobile(false)}} size={'25px'} className='cursor-pointer hover:text-gray-600 hover:bounce-once'/>
                    <SendIcon size={'23px'} className='cursor-pointer hover:text-gray-600 hover:bounce-once' />
                </div>
                <Bookmark onClick={()=>SavePost(user, isSaved,setisSaved,setSavedPosts,post,savedPosts,dispatch)} fill={isSaved ? 'white' : ''} size={'25px'} className='cursor-pointer hover:text-gray-600'/>
            </div>
            <span onClick={()=>getLikes()} className='font-medium block mb-2 px-3'>{curLikes} likes</span>
            <span className='text-sm block mb-2 px-3'>{timeAgo(post?.createdAt)}</span>
            <hr/>
            <div className='flex items-center'>
                <input type="text" placeholder="Add a comment..." className='w-full p-3 rounded-md h-10 focus:outline-none focus:ring-0' value={commenttext} onChange={(e)=>{e.target.value.trim() ? setCommenttext(e.target.value) : setCommenttext("")}} />
                <Button onClick={()=>handleNewComment(user,post,profile,feed,comments,setComments,commenttext,setCommenttext,dispatch,setCurComments)} disabled={!commenttext} className="bg-transparent text-blue-400 hover:bg-[rgba(255,255,255,0.1)]">Post</Button>
            </div>
        </div>
    </div>
  )
}

export default PostDialog   