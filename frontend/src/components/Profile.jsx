import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import useGetUser from "@/hooks/useGetUser";
import { Heart, MessageCircle } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import PostDialog from "./PostDialog";
import { toast } from "sonner";
import { setProfile } from "@/redux/authSlice";
import ChangePfp from "./ChangePfp";
import UpdateProfile from "./EditProfile";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const [openPostDialog, setOpenPostDialog] = useState(false);
    const [openPfpDialog, setopenPfpDialog] = useState(false);
    const [openEditDialog, setopenEditDialog] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [postorsaved, setPostOrSaved] = useState(true);
    const navigate = useNavigate();
    const params = useParams();
    const userId = params.username;
    useGetUser(userId);
    const dispatch = useDispatch();
    const { profile,user,savedPosts } = useSelector((store) => store.auth);
    const [isfollowed, setIsFollowed] = useState(profile?.followers.includes(user?.id));

    useEffect(() => {
        if (profile && user) {
            setIsFollowed(profile?.followers.includes(user?.id));
        }
    }, [profile, user]);

    const handleFollow = async () => {
        try{
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/followorunfollow/${profile._id}`,{
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            if(data.success){
                setIsFollowed(prev=>!prev);
                let newfollowers = isfollowed ? profile.followers.filter((id)=> id!=user?.id) : [...profile.followers, user?.id]
                dispatch(setProfile({...profile, followers : newfollowers}))
                toast.success(isfollowed ? "Unfollowed successfully" : "Followed successfully");
              }else{
                toast.error('Failed to Follow/Unfollow');
              }
        }catch(e){
            toast.error(e.message);
            console.log(e);
        }
    }
    console.log(isfollowed)
    return (
        <div className="min-h-screen flex-1 my-3 flex flex-col items-center sm:pl-[20%]">
            <div className="w-full flex items-start mt-10 mb-5 p-2 sm:pl-[20%]">
                <ChangePfp open={openPfpDialog} setOpen={setopenPfpDialog} />
                <Avatar onClick={()=>{if(profile?._id==user?.id) setopenPfpDialog(true)}} className="h-25 w-25 sm:h-40 sm:w-40 hover:cursor-pointer">
                    <AvatarImage src={profile?.profilePic} alt="postimg" className='object-cover rounded-lg aspect-square' />
                    <AvatarFallback>USER</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-5 mx-5 sm:mx-20">
                    <div className="flex gap-5">
                        <h1 className="text-xl ">{profile?.username}</h1>
                        <UpdateProfile open={openEditDialog} setOpen={setopenEditDialog} />
                        {!user ? (<Button onClick={()=>navigate('/login')} className="bg-blue-400 text-white text-sm">Login to Follow</Button>) : profile?._id==user?.id ? (<Button onClick={()=>{setopenEditDialog(true)}}>Edit profile</Button>) : (<Button onClick={()=>handleFollow()} className="bg-blue-400 text-white text-lg">{isfollowed ? "Following" : "Follow"}</Button>)}
                    </div>
                    <div className="hidden sm:flex gap-5 sm:gap-10">
                        <div className="flex">
                            <p className="font-medium">{profile?.posts.length}</p>
                            <span className="mx-2 text-gray-400">posts</span>
                        </div>
                        <div className="flex">
                            <p className="font-medium">{profile?.followers.length}</p>
                            <span className="mx-2 text-gray-400">followers</span>
                        </div>
                        <div className="flex">
                            <p className="font-medium">{profile?.following.length}</p>
                            <span className="mx-2 text-gray-400">following</span>
                        </div>
                    </div>
                    <div className="hidden sm:flex flex-col self-start gap-1">
                        <h1 className="font-bold">{profile?.name}</h1>
                        <p>{profile?.bio}</p>
                    </div>
                    <div className="pl-5 flex flex-col sm:hidden gap-1 mb-5">
                        <h1 className="font-bold">{profile?.name}</h1>
                        <p>{profile?.bio}</p>
                </div>
                </div>
            </div>

            <div className="flex sm:hidden gap-10">
                        <div className="flex">
                            <p className="font-medium">{profile?.posts.length}</p>
                            <span className="mx-2 text-gray-400">posts</span>
                        </div>
                        <div className="flex">
                            <p className="font-medium">{profile?.followers.length}</p>
                            <span className="mx-2 text-gray-400">followers</span>
                        </div>
                        <div className="flex">
                            <p className="font-medium">{profile?.following.length}</p>
                            <span className="mx-2 text-gray-400">following</span>
                        </div>
            </div>
            <div className="flex items-center w-full pt-5">
                <hr className="text-white w-full"/>
            </div>
            {profile?._id==user?.id ?
            <div className="flex items-center justify-between gap-10">
                <Button onClick={()=>setPostOrSaved(true)} className={`bg-transparent text-white hover:cursor-pointer hover:bg-transparent ${postorsaved ? 'border-t-4 border-white' : ''}`}>POSTS</Button>
                <Button onClick={()=>setPostOrSaved(false)} className={`bg-transparent text-white hover:cursor-pointer hover:bg-transparent ${postorsaved ? '' : 'border-t-4 border-white'}`}>SAVED</Button>
            </div>
            : <></>
            }
            <div className="grid my-10 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 items-center pb-10">
                {postorsaved ? profile?.posts.length > 0 ? profile?.posts.map((post) => {
                    return (
                        <div onClick={() => {setSelectedPost(post);setOpenPostDialog(true);}} key={post._id} className="relative h-[400px] w-[300px] group hover:cursor-pointer overflow-hidden rounded-lg">
                            <img src={post.image} alt="postimg" className="object-cover w-full h-full group-hover:opacity-70 "/>
                            <div className="absolute flex items-center justify-center bottom-0 left-0 h-full w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex gap-5 text-white">
                                <div className="flex items-center">
                                    <Heart fill="white" />
                                    <span className="font-bold mx-2">{post.likes.length}</span>
                                </div>
                                <div className="flex items-center">
                                    <MessageCircle fill="white" />
                                    <span className="font-bold mx-2">{post.comments.length}</span>
                                </div>
                                </div>
                            </div>
                        </div>
                    );
                }) : (<div className='col-start-2'><h1 className='text-2xl'>No posts yet</h1></div>)
                : savedPosts?.length > 0 ? savedPosts?.map((post) => {
                    return (
                        <div onClick={() => {setSelectedPost(post);setOpenPostDialog(true);}} key={post._id} className="relative h-[400px] w-[300px] group hover:cursor-pointer overflow-hidden rounded-lg">
                            <img src={post.image} alt="postimg" className="object-cover w-full h-full group-hover:opacity-70 "/>
                            <div className="absolute flex items-center justify-center bottom-0 left-0 h-full w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex gap-5 text-white">
                                <div className="flex items-center">
                                    <Heart fill="white" />
                                    <span className="font-bold mx-2">{post.likes.length}</span>
                                </div>
                                <div className="flex items-center">
                                    <MessageCircle fill="white" />
                                    <span className="font-bold mx-2">{post.comments.length}</span>
                                </div>
                                </div>
                            </div>
                        </div>
                    );
                }) : (<div className='col-start-2'><h1 className='text-2xl'>No saved posts yet</h1></div>)
                }
                {selectedPost && (
                    <Dialog open={openPostDialog} onOpenChange={setOpenPostDialog}>
                        <DialogContent
                        className="max-w-5xl p-0 flex flex-col focus:outline-none focus:ring-0"
                        onInteractOutside={() => setOpenPostDialog(false)}
                        >
                        <PostDialog setOpenPostDialog={setOpenPostDialog} post={selectedPost} />
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
};

export default Profile;