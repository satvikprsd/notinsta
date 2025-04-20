import { setProfile } from "@/redux/authSlice";
import { setFeed } from "@/redux/postSlice";
import { toast } from "sonner";


export const handleLike = async (user,profile,post,posts,isLiked,setIsLiked,setCurLikes,dispatch) => {
    console.log(post)
    if (!user) toast.error('Please login to like');
    else {
        try{
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/post/${post._id}/likeordislike`, {credentials: 'include'});
            const data = await response.json();
            if(data.success) {
                console.log(data);
                toast.success(isLiked ? "Disliked post" : "Liked post");
                const newLikes = posts.map(p=> p._id === post._id ? {...p, likes: isLiked ? p.likes.filter(id => id!==user._id) : [...p.likes,user._id]} : p);
                dispatch(setFeed(newLikes));
                if (profile && profile._id == post.author._id){
                    const newlikes = profile.posts.map(p=> p._id === post._id ? {...p, likes: isLiked ? p.likes.filter(id => id!==user._id) : [...p.likes,user._id]} : p);
                    dispatch(setProfile({...profile, posts:newlikes}));
                }
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
    console.log(now,lastclick,now-lastclick);
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
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/post/${post?._id}/save`, {credentials: 'include'})
            const data = await response.json();
            if (data.success){
            if (isSaved){
                dispatch(setSavedPosts(savedPosts.filter((post)=>post._id!=post?._id)));
                toast.success('Post removed from saved successfully');
            }
            else{
                dispatch(setSavedPosts([post, ...savedPosts]))
                toast.success('Post added to saved successfully');
            }
            setisSaved(prev=>!prev);
            }
            else{
                console.log(data);
                toast.error('Failed to save Post');
            }
        }catch(e){
            console.log(e);
            toast.error('Failed to save Post');
        }
    }
}