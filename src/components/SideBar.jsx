import { Heart, Home, LogOut, LogOutIcon, MessageCircle, Play, PlayCircle, PlaySquareIcon, PlusSquare, Search, Settings, Video, VideoIcon } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Logo from "./notinsta.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useSelector } from "react-redux";
const SideBar = () => {
    const navigate = useNavigate();
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
                <AvatarImage src={user?.profilePic} />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            ), path: "/profile" },
        { label: "Logout", icon: <LogOut color="#fff" className="min-w-[24px]"/>, path: "/login" },
    ]
    const logout = async () => {
        try {
            const response = await fetch('http://localhost:8000/api/v1/user/logout');
            console.log(response)
            const data = await response.json();
            if (data.success) {
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
    }

    return (
        <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-900 w-[16%] h-screen">
            <div className="flex flex-col">
                <div>
                    <Link to="/">
                        <img src={Logo} alt="Description" width="200" className="my-8 pl-3"/>
                    </Link>
                    {sidebarItems.map(item => (
                            <div onClick={()=>sidebarClickHandler(item.label)} key={item.label} className="flex items-center gap-5 relative hover:bg-gray-700 cursor-pointer rounded-lg p-3 my-3">
                                    {item.icon}
                                    <span className="text-sm text-gray-400">{item.label}</span>
                            </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SideBar;