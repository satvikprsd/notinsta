import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { useParams } from "react-router-dom";
import useGetUser from "@/hooks/useGetUser";
import { Heart, MessageCircle } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import PostDialog from "./PostDialog";

const Profile = () => {
    const [OpenPostDialog, setOpenPostDialog] = useState(false);
    const params = useParams();
    const userId = params.username;
    useGetUser(userId);
    const { profile } = useSelector((store) => store.auth);
    return (
        <div className="h-full flex-1 my-3 flex flex-col items-center pl-[20%]">
            <div className="w-full flex items-start my-10 px-40">
                <Avatar className="h-40 w-40">
                    <AvatarImage src={profile?.profilePic} alt="postimg" className='object-cover rounded-lg aspect-square' />
                    <AvatarFallback>USER</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-5 mx-20">
                    <div className="flex gap-5">
                        <h1 className="text-xl ">{profile?.username}</h1>
                        <Button>Edit profile</Button>
                    </div>
                    <div className="flex gap-10">
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
                    <div className="flex flex-col gap-1">
                        <h1 className="font-bold">{profile?.name}</h1>
                        <p>{profile?.bio}</p>
                    </div>
                </div>
            </div>
            <div className="flex items-center w-full px-30">
                <hr className="text-white w-full"/>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1">
                {profile?.posts.map((post) => {
                    return (
                        <div onClick={()=>{()=>setOpenPostDialog(true)}} key={post._id} className="relative h-[400px] w-[300px] group hover:cursor-pointer overflow-hidden rounded-lg">
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
                            <Dialog open={OpenPostDialog}>
                                <DialogContent className='max-w-5xl p-0 flex flex-col focus:outline-none focus:ring-0' onInteractOutside={()=>setOpenPostDialog(false)}>
                                    <PostDialog post={post}/>
                                </DialogContent>
                            </Dialog>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Profile;