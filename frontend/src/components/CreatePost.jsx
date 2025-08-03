import React, { useEffect, useRef, useState } from 'react'
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import Loader from './ui/loader';
import { ArrowLeft, Loader2, Loader2Icon, Volume2, VolumeOff, VolumeX } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setFeed } from '@/redux/postSlice';
import { setProfile } from '@/redux/authSlice';

const CreatePost = ({ open, setOpen }) => {
    const imgref = useRef();
    const [file, setFile] = useState(null);
    const [fileType, setFileType] = useState(null);
    const [caption, setCaption] = useState('');
    const videoRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(true);
    const [isMuted, setIsMuted] = useState(true);
    const [imgPreview, setImgPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const {feed} = useSelector(store => store.posts);
    const { user,profile } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        console.log(file.type)
        setFileType(file.type);
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
        // console.log(feed,"posts")
        setLoading(true);
        const postData = new FormData();
        if (imgPreview) {
            postData.append(fileType.split('/')[0], file);
        }
        postData.append('caption', caption);
        try {
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/post/newpost/${fileType.split('/')[0]}`, {
                method: 'POST',
                credentials: 'include',
                body: postData,
            })
            const data = await response.json();
            if (data.success) {
                dispatch(setFeed([data.post, ...feed]));
                if (profile._id == user._id) {
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

    useEffect(()=>{
        if (videoRef.current){
            videoRef.current.muted = isMuted
        }
    }, [isMuted])


    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className={`px-0 w-[468px] h-[785px] focus:outline-none focus:ring-0 bg-[rgb(38,38,38)] flex flex-col`}>
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
                            {imgPreview && (
                                <div className="absolute left-0">
                                    <Button onClick={() => {setImgPreview(null);setFile(null);setCaption('');setOpen(false)}} className="ml-2 max-h-7 bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer">
                                        <ArrowLeft />
                                    </Button>
                                </div>
                            )}
                        </div>
                    </DialogHeader>
                    <div className={`h-[calc(100%-72px)] flex gap-4 flex-col flex-1 ${imgPreview ? '' : 'items-center justify-center'}`}>
                        {
                            imgPreview && (
                                <div className='relative bg-black flex w-[468px] h-[585px] justify-center items-center'>
                                    {fileType.split('/')[0] == 'image' && <img className='object-cover' src={imgPreview} alt='post' />}
                                    {/* {fileType.split('/')[0] == 'video' && <video id='video' className='object-cover max-h-80 sm:max-h-full' src={imgPreview} alt='post' />} */}
                                    {fileType.split('/')[0] == 'video' && <video autoPlay muted playsInline onContextMenu={(e) => e.preventDefault()} loop onClick={()=>{if (isPlaying) {videoRef.current?.pause();setIsPlaying(false)} else {videoRef.current?.play();setIsPlaying(true)}}} ref={videoRef} src={imgPreview} alt="postimg" className='object-cover max-h-80 sm:max-h-full' />}
                                    {fileType.split('/')[0] == 'video' && !isPlaying && <div onClick={()=>{if (isPlaying) {videoRef.current?.pause();setIsPlaying(false)} else {videoRef.current?.play();setIsPlaying(true)}}} size={'80px'} className='absolute' style={{left: "50%",top: "50%",transform: "translate(-50%, -50%)",backgroundImage: `url('https://static.cdninstagram.com/images/instagram/xig_legacy_spritesheets/sprite_video_2x.png?__makehaste_cache_breaker=QGBM-RRQtO6')`,backgroundPosition: '0px 0px',backgroundRepeat: 'no-repeat',backgroundSize: '271px 149px',width: '135px',height: '135px',cursor: 'pointer',display: 'block',}}></div>}
                                    {fileType.split('/')[0] == 'video' && 
                                        <div onClick={()=>setIsMuted(prev => !prev)} className='absolute right-0 bottom-0 m-3 bg-[#22262C] w-7 h-7 hover:cursor-pointer rounded-full flex items-center justify-center' >
                                            {isMuted ? <VolumeOff fill='white' size={15} className='' /> : <Volume2 fill='white' size={15} className='' />}
                                        </div>
                                    }
                                </div>)
                        }
                        <input ref={imgref} type='file' className='hidden' onChange={handleFileChange} />
                        {!imgPreview && <Button onClick={() => imgref.current.click()} className='bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer'>Select from computer</Button>}
                        {imgPreview && <Textarea className="focus:outline-none focus:ring-0 h-fit min-h-[70px]" placeholder="Write a caption... " value={caption} onChange={(e) => { e.target.value.trim() ? setCaption(e.target.value) : setCaption("") }}></Textarea>}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default CreatePost
