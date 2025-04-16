import React, { useRef, useState } from 'react'
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Button } from './ui/button';
import { Loader2Icon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser, setProfile, } from '@/redux/authSlice';

const ChangePfp = ({ open, setOpen }) => {
    const imgref = useRef();
    const [file, setFile] = useState(null);
    const [imgPreview, setImgPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user, profile } = useSelector(store => store.auth);
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
    const handleNewPfp = async () => {
        setLoading(true);
        const postData = new FormData();
        if (imgPreview) {
            postData.append('profilePic', file);
        }
        try {
            const response = await fetch('https://notinsta-gr7b.onrender.com/api/v1/user/profile/edit', {
                method: 'POST',
                credentials: 'include',
                body: postData,
            })
            const data = await response.json();
            if (data.success) {
                dispatch(setAuthUser({...user, profilePic: data?.user.profilePic}));
                dispatch(setProfile({...profile, profilePic: data?.user.profilePic}));
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
            setFile(null);
            setOpen(false);
        }
    }
    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className={`px-0 max-w-4xl ${imgPreview ? "h-[500px] w-[500px]" : "h-[300px] w-[300px]"} focus:outline-none focus:ring-0 bg-[rgb(38,38,38)] flex flex-col`}>
                <div className='flex flex-col gap-5 items-center w-full h-full flex-1 overflow-hidden'>
                    <DialogHeader className='text-xl font-semibold text-center w-full sm:text-center'>
                        <div className="relative w-full flex items-center justify-center">
                            <div className="text-center w-full">Change Profile Picture</div>
                            {imgPreview && (
                                <div className="absolute right-0">
                                    <Button onClick={handleNewPfp} className="mr-2 max-h-7 bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer">
                                        {loading ? <Loader2Icon className='h-4 w-4 animate-spin' />: "Change"}
                                    </Button>
                                </div>
                            )}
                        </div>
                    </DialogHeader>
                    <div className={`h-full w-full flex flex-1 ${imgPreview ? '' : 'items-center justify-center'}`}>
                        {
                            imgPreview && (
                                <div className='flex-1 flex justify-center items-center'>
                                    <img className='object-cover max-w-2xl h-full' src={imgPreview} alt='profilepic' />
                                </div>)
                        }
                        <input ref={imgref} type='file' className='hidden' onChange={handleFileChange} />
                        {!imgPreview && <Button onClick={() => imgref.current.click()} className='bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer'>Select from computer</Button>}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ChangePfp
