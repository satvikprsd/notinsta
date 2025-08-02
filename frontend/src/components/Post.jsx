import React, { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Dialog, DialogContent} from './ui/dialog'
import { Bookmark, Heart, MessageCircle, MoreHorizontal, PlayIcon, SendIcon, Volume2, VolumeOff, VolumeX } from 'lucide-react'
import { Button } from './ui/button'
import PostDialog from './PostDialog'
import HelpDialog from './HelpDialog'
import { useDispatch, useSelector } from 'react-redux'
import { handleDoubleClick, handleLike, handleNewComment, LikesDialog, SavePost } from './PostHandler'
import { Link, useNavigate } from 'react-router-dom'
import { setSavedPosts, setSelectedChat } from '@/redux/authSlice'
import NotextLogo from "./notinstalogo.png";
import { useInView } from 'react-intersection-observer'


const Post = ({post}) => {
    const [commenttext, setCommenttext] = useState('')
    const [OpenPostDialog, setOpenPostDialog] = useState(false)
    const [curLikes, setCurLikes] = useState(post?.likes.length);
    const [curComments, setCurComments] = useState(post.comments?.length);
    const { user, savedPosts } = useSelector(store => store.auth);
    const [isLiked, setIsLiked] = useState(post?.likes.map((f)=>f._id).includes(user?._id));
    const [doubleClick,setdoubleClick] = useState(false);
    const { feed } = useSelector(store => store.posts);
    const [comments, setComments] = useState(post.comments);
    const [lastclick, setlastclick] = useState(0);
    const [isSaved, setisSaved] = useState(savedPosts?.map((post)=>post._id).includes(post?._id));
    const [islikerfollowed, setIslikerFollowed] = useState({});
    const [openlikesdialog, setOpenlikesDialog] = useState(false);
    const navigate = useNavigate();
    const likes = post?.likes;
    // console.log(likes,"likes")
    const dispatch = useDispatch();
    const [blobUrl, setBlobUrl] = useState(null);
    const { ref, inView } = useInView({ threshold: 0.5 });
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
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
        const fetchImage = async () => {
          const response = await fetch(post.image);
          const blob = await response.blob();
          const url = URL.createObjectURL(blob);
          setBlobUrl(url);
        };
    
        fetchImage();
    
        return () => {
          if (blobUrl) URL.revokeObjectURL(blobUrl);
        };
      }, [post.image]);
    
    useEffect(() => {
        const video = videoRef.current;
        console.log(video)
        if (!video) return;
        if (inView) {
            video.play().then(()=>{setIsPlaying(true)}).catch(() => {});
        } else {
            setIsPlaying(false);
            video.pause();
        }
    }, [inView]);

    useEffect(()=>{
        if (videoRef.current){
            videoRef.current.muted = isMuted
        }
    }, [isMuted])

    return (
    <div className='mt-8 w-[390px] sm:w-[468px] max-w-lg mx-auto'>
        {user && <LikesDialog openlikesdialog={openlikesdialog} setOpenlikesDialog={setOpenlikesDialog} likes={likes} islikerfollowed={islikerfollowed} setIslikerFollowed={setIslikerFollowed} dispatch={dispatch} user={user} />}
        <div className='flex items-center justify-between pb-3'>
            <div className='flex items-center gap-3'>
                <Link to={`/profile/${post?.author.username}`}>
                <Avatar className="ml-5 md:ml-0 h-10 w-10">
                    <AvatarImage src={post?.author.profilePic=='default.jpg' ? NotextLogo : post?.author.profilePic} alt="postimg" className='object-cover rounded-lg aspect-square' />
                    <AvatarFallback>User</AvatarFallback>
                </Avatar>
                </Link>
                <Link to={`/profile/${post?.author.username}`}>
                    <h1>{post.author?.username}</h1>
                </Link>
            </div>
            <HelpDialog isSaved={isSaved} setisSaved={setisSaved} post={post} />
        </div>
        {console.log(isPlaying)}
        <div className='relative w-full h-full flex items-center justify-center border-1 border-[rgb(38,38,38)]'>
            {post.image.split('/')[4] == 'image' && <div style={{backgroundImage: `url(${blobUrl})`}} onClick={()=>handleDoubleClick(user,null,post,feed,isLiked,setIsLiked,setCurLikes,dispatch,setdoubleClick,lastclick,setlastclick,handleLike)}  alt="postimg" className="w-full aspect-square bg-center bg-cover" />}
            {post.image.split('/')[4] == 'video' && <video muted playsInline onContextMenu={(e) => e.preventDefault()} loop onClick={()=>{handleDoubleClick(user,null,post,feed,isLiked,setIsLiked,setCurLikes,dispatch,setdoubleClick,lastclick,setlastclick,handleLike); if (isPlaying) {videoRef.current?.pause();setIsPlaying(false)} else {videoRef.current?.play();setIsPlaying(true)}}} ref={(node)=>{videoRef.current=node;ref(node)}} src={blobUrl} alt="postimg" className='w-[320px] h-[585px] object-cover hover:cursor-pointer' />}
            {post.image.split('/')[4] == 'video' && !isPlaying && <div onClick={()=>{if (isPlaying) {videoRef.current?.pause();setIsPlaying(false)} else {videoRef.current?.play();setIsPlaying(true)}}} size={'80px'} className='absolute' style={{left: "50%",top: "50%",transform: "translate(-50%, -50%)",backgroundImage: `url('https://static.cdninstagram.com/images/instagram/xig_legacy_spritesheets/sprite_video_2x.png?__makehaste_cache_breaker=QGBM-RRQtO6')`,backgroundPosition: '0px 0px',backgroundRepeat: 'no-repeat',backgroundSize: '271px 149px',width: '135px',height: '135px',cursor: 'pointer',display: 'block',}}></div>}
            {post.image.split('/')[4] == 'video' && 
                <div className='absolute right-0 bottom-0 m-3 bg-[#22262C] w-7 h-7 hover:cursor-pointer rounded-full flex items-center justify-center' >
                    {isMuted ? <VolumeX fill='white' onClick={()=>setIsMuted(false)} size={15} className='' /> : <Volume2 fill='white' onClick={()=>setIsMuted(true)} size={15} className='' />}
                </div>
            }
            {doubleClick && <Heart style={{left: "50%",top: "50%",transform: "translate(-50%, -50%)",}} size={'150px'} fill='red' className='absolute text-red-500 animate-fly-up' />}
        </div>
        <div className='mx-5 md:mx-0 flex items-center justify-between my-2'>
            <div className='flex items-center gap-3'>
                <Heart onClick={()=>handleLike(user,null,post,feed,isLiked,setIsLiked,setCurLikes,dispatch)} size={'25px'} className={`cursor-pointer hover:text-gray-600 hover:bounce-once`} fill={isLiked ? 'red' : 'none'} stroke={isLiked ? 'red' : 'currentColor'} />
                <MessageCircle onClick={()=>{window.innerWidth <= 1024 ? navigate(`/p/${post?._id}`) : setOpenPostDialog(true)}} size={'25px'} className='cursor-pointer hover:text-gray-600'/>
                <SendIcon onClick={()=>{dispatch(setSelectedChat(post.author));navigate(`/chat`)}} size={'23px'} className='cursor-pointer hover:text-gray-600' />
            </div>
            <Bookmark onClick={()=>SavePost(user, isSaved,setisSaved,setSavedPosts,post,savedPosts,dispatch)} fill={isSaved ? 'white' : ''} size={'25px'} className='cursor-pointer hover:text-gray-600'/>
        </div>
        <div className='mx-5 md:mx-0'>
        <span onClick={()=>getLikes()} className=' font-medium block '>{curLikes} likes</span>
        <span className='font-medium mb-2'>{post.author?.username} </span>
        <span className='font-light mb-2'>{post.caption}</span>
        </div>
        {curComments>0 && <span onClick={()=>setOpenPostDialog(true)} className='mx-5 md:mx-0 font-light block hover:cursor-pointer'>View all {curComments} comments</span>}
        <Dialog open={OpenPostDialog}>
            <DialogContent className='max-w-6xl p-0 flex items-center lg:items-stretch flex-col focus:outline-none focus:ring-0' onInteractOutside={()=>setOpenPostDialog(false)}>
                <PostDialog setOpenPostDialog={setOpenPostDialog} newsetIsLiked={setIsLiked} newisLiked={isLiked} newcurLikes={curLikes} newsetCurLikes={setCurLikes} newsetCurComments={setCurComments}  post={post}/>
            </DialogContent>
        </Dialog>
        <div className='mx-2 md:mx-0 hidden lg:flex items-center'>
            <input type="text" placeholder="Add a comment..." className='w-full p-3 rounded-md h-10 focus:outline-none focus:ring-0' value={commenttext} onChange={(e)=>{e.target.value.trim() ? setCommenttext(e.target.value) : setCommenttext("")}} />
            {commenttext && <Button onClick={()=>handleNewComment(user,post,null,feed,comments,setComments,commenttext,setCommenttext,dispatch,setCurComments)} className="bg-transparent text-blue-400 hover:bg-[rgba(255,255,255,0.1)]">Post</Button>}
        </div>
    </div>
  )
}

export default Post