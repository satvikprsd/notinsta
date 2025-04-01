import { Heart, Home, LogOut, LogOutIcon, MessageCircle, Play, PlayCircle, PlaySquareIcon, PlusSquare, Search, Settings, Video, VideoIcon } from "lucide-react";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Logo from "./notinsta.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const sidebarItems = [
    { label: "Home", icon: <Home color="#fff"/>, path: "/home" },
    { label: "Search", icon: <Search color="#fff"/>, path: "/search" },
    { label: "Reels", icon: <PlayCircle color="#fff"/>, path: "/reels" },
    { label: "Messages", icon: <MessageCircle color="#fff"/>, path: "/messages" },
    { label: "Notifications", icon: <Heart color="#fff"/>, path: "/settings" },
    { label: "Upload", icon: <PlusSquare color="#fff"/>, path: "/upload" },
    { label: "Profile", 
        icon: (
        <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        ), path: "/profile" },
    { label: "Logout", icon: <LogOut color="#fff"/>, path: "/login" },
]
const SideBar = () => {
    const navigate = useNavigate();
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
            toast.error(error);
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
                        <img src={Logo} alt="Description" width="200" className="my-8"/>
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