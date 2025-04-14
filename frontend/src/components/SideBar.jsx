import { Heart, Home, LogOut, LogOutIcon, MessageCircle, Play, PlayCircle, PlaySquareIcon, PlusSquare, Search, Settings, Video, VideoIcon } from "lucide-react";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Logo from "./notinsta.png";
import NotextLogo from "./notinstalogo.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
const SideBar = () => {
    const [open,setOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {user} = useSelector(store=>store.auth);
    const sidebarItems = [
        { label: "Home", icon: <Home color="#fff" className="min-w-[24px]"/>, path: "/home" },
        { label: "Search", icon: <Search color="#fff" className="min-w-[24px]"/>, path: "/search" },
        { label: "Reels", icon: <PlayCircle color="#fff" className="min-w-[24px]"/>, path: "/reels" },
        { label: "Messages", icon: <MessageCircle color="#fff" className="min-w-[24px]"/>, path: "/messages" },
        { label: "Notifications", icon: <Heart color="#fff" className="min-w-[24px]"/>, path: "/settings" },
        { label: "Upload", icon: <PlusSquare color="#fff" className="min-w-[24px]"/>, path: "/upload" },
        { label: "Profile", 
            icon: (
            <Avatar>
                <AvatarImage src={user?.profilePic} className='object-cover rounded-lg aspect-square'/>
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            ), path: "/profile" },
        { label: "Logout", icon: <LogOut color="#fff" className="min-w-[24px]"/>, path: "/login" },
    ]
    const topbarItems = sidebarItems.filter((items)=>['Messages','Notifications'].includes(items.label)).reverse()
    const bottombarItems = sidebarItems.filter((items)=>!['Search','Messages','Notifications'].includes(items.label))
    const logout = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/user/logout');
            console.log(response)
            const data = await response.json();
            if (data.success) {
                dispatch(setAuthUser(null));
                toast.success(data.message);
                navigate("/login");
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const sidebarClickHandler = (itemtext) => {
        if(itemtext === "Logout") {
            logout();
        }
        else if(itemtext === "Upload"){
            if (user) setOpen(true);
        }
        else if(itemtext === "Profile"){
            if (!user) navigate('/login')
            else navigate(`/profile/${user?.username}`);
        }
        else if(itemtext === "Home"){
            navigate("/");
        }
    }

    return (
        <div>
        <div className="hidden md:block fixed top-0 z-10 left-0 px-4 border-r border-gray-900 xl:w-[18%] h-screen">
            <div className="flex flex-col">
                <div>
                    <Link to="/">
                        <img src={Logo} alt="Description" width="150" className="hidden xl:block my-8 pl-3"/>
                        <img src={NotextLogo} alt="Description" width="50" className="block xl:hidden my-8 pl-3"/>
                    </Link>
                    {sidebarItems.map(item => (
                            <div onClick={()=>sidebarClickHandler(item.label)} key={item.label} className="flex items-center gap-5 relative hover:bg-gray-700 cursor-pointer rounded-lg p-3 my-3">
                                    {item.icon}
                                    <span className="hidden xl:block text-sm text-gray-400">{item.label}</span>
                            </div>
                    ))}
                </div>
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>
        <div className="fixed bottom-0 z-10 left-0 right-0 border-t border-gray-800 bg-black md:hidden flex justify-around items-center h-14">
            {bottombarItems.map(item => (
                <div onClick={()=>sidebarClickHandler(item.label)} key={item.label+'-bottom'} className="flex flex-col items-center justify-center hover:text-white cursor-pointer text-gray-400 text-sm">
                    {item.icon}
                </div>
            ))}
        </div>
        <div className="fixed top-0 z-10 left-0 right-0 border-b border-gray-800 bg-black md:hidden flex justify-around items-center h-12">
            <div className="flex gap-3 w-full">
                <Link className="w-20" to="/">
                    <img src={NotextLogo} alt="Description" width="50" className="my-10 pl-3"/>
                </Link>
                <Input className='w-full bg-gray-500 opacity-50 h-10 my-10 placeholder:text-white text-white' placeholder="Search"/>
                {topbarItems.map(item => (
                <div onClick={()=>sidebarClickHandler(item.label)} key={item.label+'-top'} className="flex flex-col items-center justify-center hover:text-white cursor-pointer text-gray-400 text-sm mr-1">
                        {item.icon}
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default SideBar;