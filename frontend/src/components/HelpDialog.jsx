import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Loader2Icon, MoreHorizontal} from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'
import { setFeed } from '@/redux/postSlice'
import { setProfile, setSavedPosts } from '@/redux/authSlice'
import { useNavigate } from 'react-router-dom'
import { SavePost } from './PostHandler'

const HelpDialog = ({post,setDialog,setisSaved,isSaved}) => {
  const { user,profile,savedPosts } = useSelector(store=>store.auth);
  const {feed} = useSelector(store => store.posts);
  const [openhelp, setOpenhelp] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const DeletPost = async () => {
    setLoading(true);
    try{
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/post/delete/${post._id}`,{method: 'POST', credentials: 'include'});
      const data = await response.json();
      if(data.success){
        
        if (setDialog) setDialog(false);
        setOpenhelp(false);
        dispatch(setFeed(feed.filter(p => p?._id!==post?._id)))
        if (profile._id == user._id){
          dispatch(setProfile({...profile,posts:profile?.posts.filter((p)=>p?._id!=post?._id)}))
        }
        toast.success('Post deleted successfully');
      }else{
        toast.error('Failed to delete post');
      }
    }
    catch(error){
      console.error(error);
      toast.error('Failed to delete post');
    }
    finally{
      setLoading(false);
    }
  }


  const ViewProfile = () => {
    if(setDialog) setDialog(false);
    navigate(`/profile/${post?.author.username}`)
  }

  return (
    <Dialog open={openhelp}>
        <DialogTrigger onClick={()=>setOpenhelp(true)} asChild><MoreHorizontal className='cursor-pointer mr-5 md:mr-0' /></DialogTrigger>
        <DialogContent className="w-[300px] px-0 py-2" onInteractOutside={()=>setOpenhelp(false)}>
            <div className='flex flex-col gap-2'>
                <Button className='bg-background text-red-600 hover:bg-[rgba(255,255,255,0.1)] cursor-pointer border-0'>Report</Button>
                {user?._id == post?.author._id && <hr/>}
                {user?._id == post?.author._id && (<Button onClick={()=>DeletPost()} className='bg-background text-red-600 hover:bg-[rgba(255,255,255,0.1)] cursor-pointer border-0'>{loading ? <Loader2Icon className='h-4 w-4 animate-spin' /> : "Delete Post"}</Button>)}
                <hr/>
                <Button onClick={()=>navigate(`/p/${post?._id}`)} className='bg-background text-white hover:bg-[rgba(255,255,255,0.1)] cursor-pointer border-0 '>Go to Post</Button>
                <hr/>
                <Button onClick={()=>ViewProfile()} className='bg-background text-white hover:bg-[rgba(255,255,255,0.1)] cursor-pointer border-0'>View Profile</Button>
                <hr/>
                <Button className='bg-background text-white hover:bg-[rgba(255,255,255,0.1)] cursor-pointer border-0'>Copy Link</Button>
                <hr/>
                <Button onClick={()=>SavePost(user, isSaved,setisSaved,setSavedPosts,post,savedPosts,dispatch)} className='bg-background text-white hover:bg-[rgba(255,255,255,0.1)] cursor-pointer border-0'>{isSaved ? 'Remove from Saved' : 'Add to Saved'}</Button>
                <hr/>
                <Button onClick={()=>setOpenhelp(false)} className='bg-background text-white hover:bg-[rgba(255,255,255,0.1)] cursor-pointer border-0'>Close</Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default HelpDialog