import React, { useState } from 'react'
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Button } from './ui/button';
import { Loader2Icon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser, setProfile, } from '@/redux/authSlice';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

const UpdateProfile = ({ open, setOpen }) => {
    const { user, profile } = useSelector(store => store.auth);
    const [name, setName] = useState(user?.name);
    const [username, setUsername] = useState(user?.username);
    const [bio, setBio] = useState(user?.bio);
    const dispatch = useDispatch();


    const handleChanges = async () => {
        const postData = new FormData();
        if(name!=user?.name) postData.append('name',name);
        if(username!=user?.username) postData.append('username', username);
        if(bio!=user?.bio) postData.append('bio', bio);
        try {
            const response = await fetch('http://localhost:8000/api/v1/user/profile/edit', {
                method: 'POST',
                credentials: 'include',
                body: postData,
            })
            const data = await response.json();
            if (data.success) {
                dispatch(setAuthUser({...user, name:name, username:username, bio:bio}));
                dispatch(setProfile({...profile, name:name, username: username, bio:bio}));
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
            setOpen(false);
        }
    }
    return (
        <Dialog open={open}>
            <DialogContent onInteractOutside={() => setOpen(false)} className={`px-0 max-w-4xl w-[500px] focus:outline-none focus:ring-0 bg-[rgb(38,38,38)] flex flex-col`}>
                <div className='flex flex-col gap-5 items-center w-full h-full flex-1 overflow-hidden'>
                    <DialogHeader className='text-xl font-semibold text-center w-full sm:text-center'>
                        <div className="relative w-full flex items-center justify-center">
                            <div className="text-center w-full">Update Profile</div>
                        </div>
                    </DialogHeader>
                    <div className={`w-full flex flex-1 flex-col gap-5 items-center justify-center`}>
                        <div className='w-full px-5'>
                            <h2 className='mx-4 my-2'>Name</h2>
                            <Input onChange={(e)=>{setName(e.target.value)}} value={name} type='text' placeholder='Name' />
                        </div>
                        <div className='w-full px-5'>
                            <h2 className='mx-4 my-2'>Username</h2>
                            <Input onChange={(e)=>{setUsername(e.target.value)}} value={username} type='text' placeholder='Username' />
                        </div>
                        <div className='w-full px-5'>
                            <h2 className='mx-4 my-2'>Bio</h2>
                            <Textarea onChange={(e)=>{setBio(e.target.value)}} value={bio} type='text' placeholder='Bio' maxLength={100}/>
                        </div>
                        <Button disabled={name==user?.name && username==user?.username && bio==user?.bio} onClick={()=>{handleChanges()}}>Update</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateProfile
