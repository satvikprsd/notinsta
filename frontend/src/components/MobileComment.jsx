import React, { useEffect, useState } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Button } from './ui/button'
import { handleNewComment} from './PostHandler'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import NotextLogo from "./notinstalogo.png";

const MobileComment = ({setOpenPostDialog, newsetCurComments,post ,setMobile}) => {
    
    const [commenttext, setCommenttext] = useState('');
    const { user,profile} = useSelector(store => store.auth);
    const { feed } = useSelector(store => store.posts);
    const [comments, setComments] = useState(post?.comments);
    const dispatch = useDispatch();
    const [curCommentsState, setCurCommentsState] = useState(post?.comments.length||0);
    const setCurComments = newsetCurComments ?? setCurCommentsState;
    // console.log(post, "newtest");


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
    <div className='min-w-full flex flex-col justify-between'>
        <hr className='pb-2'/>
        <div className='h-150 overflow-y-auto p-4 custom-scrollbar'>
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
        <div className='h-12 flex items-center'>
                <input type="text" placeholder="Add a comment..." className='w-full p-3 rounded-md h-10 focus:outline-none focus:ring-0' value={commenttext} onChange={(e)=>{e.target.value.trim() ? setCommenttext(e.target.value) : setCommenttext("")}} />
                <Button onClick={()=>{handleNewComment(user,post,profile,feed,comments,setComments,commenttext,setCommenttext,dispatch,setCurComments);setMobile(false)}} disabled={!commenttext} className="bg-transparent text-blue-400 hover:bg-[rgba(255,255,255,0.1)]">Post</Button>
        </div>
    </div>
  )
}

export default MobileComment   