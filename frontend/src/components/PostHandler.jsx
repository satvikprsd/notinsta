import { setAuthUser, setProfile } from "@/redux/authSlice";
import { setFeed } from "@/redux/postSlice";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { XIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";


export const handleLike = async (user,profile,post,posts,isLiked,setIsLiked,setCurLikes,dispatch) => {
    // console.log(post)
    setCurLikes(prev=> isLiked ? prev - 1 : prev + 1);
    setIsLiked(prev=>!prev);
    if (!user) {
        toast.error('Please login to like')
        setIsLiked(prev=>!prev);
        setCurLikes(prev=> isLiked ? prev + 1 : prev - 1);
    }
    else {
        try{
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/post/${post._id}/likeordislike`, {credentials: 'include'});
            const data = await response.json();
            if(data.success) {
                // console.log(data);
                toast.success(isLiked ? "Disliked post" : "Liked post");
                const {_id,username, profilePic} = user
                const newLikes = posts.map(p=> p._id === post._id ? {...p, likes: isLiked ? p.likes.filter(f => f._id!==user._id) : [...p.likes,{_id, username, profilePic}]} : p);
                dispatch(setFeed(newLikes));
                if (profile && profile._id == post.author._id){
                    const newlikes = profile.posts.map(p=> p._id === post._id ? {...p, likes: isLiked ? p.likes.filter(id => id!==user._id) : [...p.likes,user._id]} : p);
                    dispatch(setProfile({...profile, posts:newlikes}));
                }
            }
            else {
                setIsLiked(prev=>!prev);
                setCurLikes(prev=> isLiked ? prev + 1 : prev - 1);
                toast.error(data.message);
            }
        }
        catch(error) {
            setIsLiked(prev=>!prev);
            setCurLikes(prev=> isLiked ? prev + 1 : prev - 1);
            console.error(error);
            toast.error('Failed to like or dislike post');
        }
    }
}

export const handleNewComment = async (user,post,profile,posts,comments,setComments,commenttext,setCommenttext,dispatch,setCurComments) => {
    if (!user) toast.error('Please login to comment');
    else{
        try{
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/post/${post._id}/newcomment`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({comment: commenttext.trim()})
            });
            const data = await response.json();
            if(data.success) {
                dispatch(setFeed(posts.map(p=> p._id === post._id? {...p, comments: [...comments, data.newcomment]} : p)));
                setComments([data.newcomment,...comments]);
                setCurComments(prev=>prev + 1);
                if (profile && profile._id == post.author._id){
                    const newcomment = profile.posts.map(p=> p._id === post._id? {...p, comments: [...comments, data.newcomment]} : p)
                    dispatch(setProfile({...profile,posts:newcomment}))
                }
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
}


export const handleDoubleClick = (user,profile,post,posts,isLiked,setIsLiked,setCurLikes,dispatch,setdoubleClick,lastclick,setlastclick,like) => {
    const now = Date.now();
    if (now - lastclick < 300){
        setdoubleClick(true);
        {!isLiked && like(user,profile,post,posts,isLiked,setIsLiked,setCurLikes,dispatch);}
        setTimeout(()=>setdoubleClick(false),1000);
    }
    setlastclick(now);
}

 export  const SavePost = async (user,isSaved,setisSaved,setSavedPosts,post,savedPosts,dispatch) => {
    if (!user) toast.error('Please login to save');
    else{
        setisSaved(prev=>!prev);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/post/${post?._id}/save`, {credentials: 'include'})
            const data = await response.json();
            if (data.success){
                if (isSaved){
                    dispatch(setSavedPosts(savedPosts.filter((p)=>p._id!=post?._id)));
                    toast.success('Post removed from saved successfully');
                }
                else{
                    dispatch(setSavedPosts([post, ...savedPosts]))
                    toast.success('Post added to saved successfully');
                }
            }
            else{
                setisSaved(prev=>!prev);
                toast.error('Failed to save Post');
            }
        }catch(e){
            setisSaved(prev=>!prev);
            console.log(e);
            toast.error('Failed to save Post');
        }
    }
}

export const LikesDialog = ({openlikesdialog, setOpenlikesDialog, likes, islikerfollowed, setIslikerFollowed, dispatch ,user}) => {
    const handleFollow = async (profile) => {
        setIslikerFollowed(prev => ({...prev,  [profileID]:!prev[profileID]}))
        const profileID = profile._id;
        try{
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/followorunfollow/${profileID}`,{
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            // console.log(data);
            if(data.success){
                if (islikerfollowed[profileID]){
                    const newfollowing = user?.following.filter((f)=>f._id!=profileID)
                    dispatch(setAuthUser({...user, following: newfollowing}))
                }
                else{
                    const {_id, username, profilePic} = profile;
                    dispatch(setAuthUser({...user, following:[...user.following, {_id,username,profilePic}]}))
                }
                toast.success(islikerfollowed[profileID] ? "Unfollowed successfully" : "Followed successfully");
              }else{
                setIslikerFollowed(prev => ({...prev,  [profileID]:!prev[profileID]}))
                toast.error(data.message);
              }
        }catch(e){
            setIslikerFollowed(prev => ({...prev,  [profileID]:!prev[profileID]}))
            toast.error(e.message);
            console.log(e);
        }
    }
    return (
        <Dialog open={openlikesdialog}>
            <DialogContent className="flex flex-col pb-0 pt-3 px-0 w-sm max-w-[90%] max-h-[50vh] focus:outline-none focus:ring-0" onInteractOutside={()=> setOpenlikesDialog(false)}>
                <div className="w-full flex items-center justify-between">
                    <div className="w-full flex-1 text-center font-bold">
                        <DialogTitle>Likes</DialogTitle>
                    </div>
                    <XIcon onClick={()=>setOpenlikesDialog(false)} className="absolute right-4 hover:cursor-pointer"/>
                </div>
                <hr className="border-t-2 p-0"/>
                <div className="flex flex-col overflow-y-auto custom-scrollbar">
                {likes?.map((f)=> {return (
                    <div key={f._id} className='grid grid-cols-[60px_1.9fr_1fr] items-center my-4 px-5'>
                    <Link onClick={()=>setOpenlikesDialog(false)} to={`/profile/${f.username}`}>
                        <Avatar className="h-12 w-12">
                        <AvatarImage src={f.profilePic} alt="postimg" className='object-cover rounded-lg aspect-square' />
                        <AvatarFallback>USER</AvatarFallback>
                        </Avatar>
                    </Link>
                    <div className='text-sm flex flex-col items-start gap-1'>
                        <Link onClick={()=>openlikesdialog(false)} to={`/profile/${f.username}`}>
                        <h1 className='font-bold'>{f.username}</h1>
                        </Link>
                    </div>
                    <Button onClick={()=>{handleFollow(f)}} className='text-xs hover:cursor-pointer bg-gray-800 hover:bg-gray-900 font-bold text-white'>{f._id===user._id ? 'You' : islikerfollowed[f._id] ? "Following" : "Follow"}</Button>
                    </div>
                )})}
                </div>
            </DialogContent>
        </Dialog>
    );
}
