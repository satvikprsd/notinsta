import React, { useRef, useState } from 'react'
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import Loader from './ui/loader';
import { Loader2, Loader2Icon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setFeed } from '@/redux/postSlice';
import { setProfile } from '@/redux/authSlice';

const CreatePost = ({ open, setOpen }) => {
    const imgref = useRef();
    const [file, setFile] = useState(null);
    const [caption, setCaption] = useState('');
    const [imgPreview, setImgPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const {feed} = useSelector(store => store.posts);
    const { user,profile } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImgPreview(reader.result);
            };
            setImgPreview(reader.readAsDataURL(file))
        }
    };
    const handleNewPost = async () => {
        console.log(feed,"posts")
        setLoading(true);
        const postData = new FormData();
        if (imgPreview) {
            postData.append('image', file);
        }
        postData.append('caption', caption);
        try {
            const response = await fetch('https://notinsta-gr7b.onrender.com/api/v1/post/newpost', {
                method: 'POST',
                credentials: 'include',
                body: postData,
            })
            const data = await response.json();
            if (data.success) {
                dispatch(setFeed([data.post, ...feed]));
                if (profile._id == user.id) {
                    dispatch(setProfile({...profile,posts:[data.post,...profile.posts]}))
                }
                toast.success(data.message);
            }
            else {
                console.log(data.message);
                toast.error(data.message);
            }
        }
        catch (error) {
            console.log(error);
            toast.error(error.message);
        }
        finally{
            setImgPreview(null);
            setLoading(false);
            setCaption('');
            setFile(null);
            setOpen(false);
        }
    }
    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className={`px-0 w-[95vw] sm:max-w-4xl ${imgPreview ? "h-5/6" : "h-1/2"} focus:outline-none focus:ring-0 bg-[rgb(38,38,38)] flex flex-col`}>
                <div className='flex flex-col gap-5 items-center w-full h-full flex-1 overflow-hidden'>
                    <DialogHeader className='text-xl font-semibold text-center w-full sm:text-center'>
                        <div className="relative w-full flex items-center justify-center">
                            <div className="text-center w-full ">Create new post</div>
                            {imgPreview && (
                                <div className="absolute right-0">
                                    <Button disabled={!caption} onClick={handleNewPost} className="mr-2 max-h-7 bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer">
                                        {loading ? <Loader2Icon className='h-4 w-4 animate-spin' />: "Post"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </DialogHeader>
                    <div className={`h-full w-full flex flex-col sm:flex-row flex-1 ${imgPreview ? '' : 'items-center justify-center'}`}>
                        {
                            imgPreview && (
                                <div className='flex w-full justify-center items-center'>
                                    <img className='object-cover max-w-2xl max-h-80 sm:max-h-full' src={imgPreview} alt='post' />
                                </div>)
                        }
                        <input ref={imgref} type='file' className='hidden' onChange={handleFileChange} />
                        {!imgPreview && <Button onClick={() => imgref.current.click()} className='bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer'>Select from computer</Button>}
                        {imgPreview && <Textarea className="focus:outline-none focus:ring-0 h-fit" placeholder="Write a caption... " value={caption} onChange={(e) => { e.target.value.trim() ? setCaption(e.target.value) : setCaption("") }}></Textarea>}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreatePost
