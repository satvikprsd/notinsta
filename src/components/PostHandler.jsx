import { setFeed } from "@/redux/postSlice";
import { toast } from "sonner";


export const handleLike = async (user,post,posts,isLiked,setIsLiked,setCurLikes,dispatch) => {
    console.log(post,post._id)
    try{
        const response = await fetch(`http://localhost:8000/api/v1/post/${post._id}/likeordislike`, {credentials: 'include'});
        const data = await response.json();
        if(data.success) {
            console.log(data);
            toast.success(isLiked ? "Disliked post" : "Liked post");
            const newLikes = posts.map(p=> p._id === post._id ? {...p, likes: isLiked ? p.likes.filter(id => id!==user.id) : [...p.likes,user.id]} : p);
            dispatch(setFeed(newLikes));
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

export const handleNewComment = async (post,posts,comments,setComments,commenttext,setCommenttext,dispatch,setCurComments) => {
    try{
        const response = await fetch(`http://localhost:8000/api/v1/post/${post._id}/newcomment`, {
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


export const handleDoubleClick = (user,post,posts,isLiked,setIsLiked,setCurLikes,dispatch,setdoubleClick,lastclick,setlastclick,like) => {
    const now = Date.now();
    console.log(now,lastclick,now-lastclick);
    if (now - lastclick < 300){
        setdoubleClick(true);
        {!isLiked && like(user,post,posts,isLiked,setIsLiked,setCurLikes,dispatch);}
        setTimeout(()=>setdoubleClick(false),1000);
    }
    setlastclick(now);
}
