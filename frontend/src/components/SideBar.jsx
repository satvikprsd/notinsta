import { Heart, Home, LogOut, MessageCircle, PlayCircle, PlusSquare, Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useActiveSideBar } from "./SideBarActiveContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Logo from "./notinsta.png";
import NotextLogo from "./notinstalogo.png";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser} from "@/redux/authSlice";
import CreatePost from "./CreatePost";
import { Input } from "./ui/input";
import Searchuser from "./SearchUser";
import { useSearch } from "./SearchContext";
import { useChat } from "./ChatContext";
const SideBar = () => {
    const [open,setOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { activeItem, setActiveItem } = useActiveSideBar();
    const {user} = useSelector(store=>store.auth);
    const { chatOpen, setChatOpen } = useChat();
    const { searchOpen, setSearchOpen } = useSearch();
    const [searchtext, setSearchText] = useState('')
    const sidebarItems = [
        { label: "Home", icon: <Home color="#fff" className="min-w-[24px]"/>, path: "/home" },
        { label: "Search", icon: <Search color="#fff" className="min-w-[24px]"/>, path: "/search" },
        { label: "Reels", icon: <PlayCircle color="#fff" className="min-w-[24px]"/>, path: "/reels" },
        { label: "Messages", icon: <MessageCircle color="#fff" className="min-w-[24px]"/>, path: "/messages" },
        { label: "Notifications", icon: <Heart color="#fff" className="min-w-[24px]"/>, path: "/settings" },
        { label: "Upload", icon: <PlusSquare color="#fff" className="min-w-[24px]"/>, path: "/upload" },
        { label: "Profile", 
            icon: (
            <Avatar className="-ml-1">
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
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`);
            // console.log(response)
            const data = await response.json();
            if (data.success) {
                dispatch(setAuthUser(null));
                toast.success(data.message);
                Promise.resolve().then(() => {
                    navigate("/login");
                });
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    const sidebarClickHandler = (itemtext) => {
        if(itemtext === "Logout") {
            setChatOpen(false);
            setSearchOpen(false);
            Promise.resolve().then(() => {
                logout();
            });
        }
        else if(itemtext === "Upload"){
            setActiveItem('Upload')
            setSearchOpen(false);
            setChatOpen(false);
            if (user) setOpen(true);
        }
        else if(itemtext === "Profile"){
            setSearchOpen(false);
            setChatOpen(false);
            setActiveItem('Profile')
            if (!user) Promise.resolve().then(() => {
                navigate("/login");
            });
            else Promise.resolve().then(() => {
                navigate(`/profile/${user?.username}`);
            });
        }
        else if(itemtext === "Home"){
            setActiveItem('Home')
            setChatOpen(false);
            setSearchOpen(false);
            Promise.resolve().then(() => {
                navigate("/");
            });
        }
        else if (itemtext === "Search") {
            setActiveItem('Search')
            setSearchOpen(prev => !prev);
        }
        else if(itemtext === "Messages") {
            setActiveItem('Messages')
            setSearchOpen(false)
            setChatOpen(true);
            Promise.resolve().then(() => {
                navigate("/chat");
            });
        }
    }

    useEffect(()=>{
        if(!searchOpen) setSearchText('')
    },[searchOpen])

    return (
        <div>
        <div className={`hidden md:block fixed top-0 z-10 left-0 px-4 border-r border-gray-900 ${searchOpen ? "xl:w-[30%]" : chatOpen ? "xl:block" : "xl:w-[18%]"} bg-background h-screen`}>
            <div className="flex min-h-32">
                <Link onClick={()=>{setChatOpen(false);setSearchOpen(false);setActiveItem('Home')}} to="/">
                    <img src={Logo} alt="Description" width="150" className={`hidden ${searchOpen || chatOpen ? "" : "xl:block"} my-8 pl-3`}/>
                    <img src={NotextLogo} alt="Description" width="50" className={`block ${searchOpen || chatOpen ? "" : "xl:hidden"} my-8 pl-1`}/>
                </Link>
                {searchOpen && 
                <div className="flex pl-10 pb-1 justify-start items-center w-full">
                    <h1 className="font-bold text-2xl">Search</h1>
                </div>}
            </div>
            <div className="flex">
                <div className={`flex w-full ${searchOpen || chatOpen ? "max-w-[50px] mr-3" : ""}`}>
                    <div className="flex gap-3 flex-col w-full h-full">
                        {sidebarItems.map(item => (
                                <div onClick={()=>sidebarClickHandler(item.label)} key={item.label} className={`flex items-center gap-5 relative ${activeItem===item.label ? 'bg-gray-800' : ''} hover:bg-gray-700 cursor-pointer rounded-lg h-15 px-3`}>
                                        {item.icon}
                                        <span className={`hidden ${activeItem===item.label ? 'font-bold' : ''} ${searchOpen || chatOpen ? "" : "xl:block"} text-md text-white` }>{item.label}</span>
                                </div>
                        ))}
                    </div>
                </div>
                {searchOpen && 
                    <div className="w-full">
                        <Search className='absolute left-[84px] top-34 w-6 h-6 search-icon' />
                        <Input autoFocus value={searchtext} onChange={(e)=>setSearchText(e.target.value.trim())} className={`w-[100%]  mb-5  ${searchtext ? 'pl-2' : 'pl-8'} focus:pl-2 bg-gray-500/50  h-10  placeholder:text-white text-white`} placeholder="Search"
                            onFocus={() => document.querySelector('.search-icon').classList.add('hidden')} 
                            onBlur={() => {if(!searchtext) {document.querySelector('.search-icon').classList.remove('hidden')}}}
                        />
                        <hr />
                        <div className="bg-background bg-opacity-80 p-2 mt-2 rounded-lg max-h-[80%] overflow-y-auto custom-scrollbar z-20">
                            <Searchuser searchtext={searchtext} />
                        </div>
                    </div>}
            </div>
            <CreatePost open={open} setOpen={setOpen} />
        </div>
        <div className="fixed bottom-0 z-10 left-0 right-0 border-t border-gray-800 bg-background md:hidden flex justify-around items-center h-14">
            {bottombarItems.map(item => (
                <div onClick={()=>sidebarClickHandler(item.label)} key={item.label+'-bottom'} className="flex flex-col items-center justify-center hover:text-white cursor-pointer text-gray-400 text-sm">
                    {item.icon}
                </div>
            ))}
        </div>
        <div className="fixed top-0 z-10 left-0 right-0 border-b border-gray-800 bg-background md:hidden flex justify-around items-center h-12">
            <div className="flex gap-3 w-full relative">
                <Link className="w-20" to="/">
                    <img src={NotextLogo} alt="Description" width="50" className="my-10 pl-3"/>
                </Link>
                <div className="w-full relative mt-10 h-9">
                    <Input value={searchtext} onChange={(e)=>setSearchText(e.target.value.trim())} className={`w-[100%]  mb-5  ${searchtext ? 'pl-2' : 'pl-8'} focus:pl-2 bg-gray-500/50  h-9  placeholder:text-white text-white`} placeholder="Search"
                        onFocus={() => {setSearchOpen(true); document.querySelector('.search-icon').classList.add('hidden')}} 
                        onBlur={() => {if(!searchtext) {document.querySelector('.search-icon').classList.remove('hidden')}}}
                    />
                    {searchtext && searchOpen && (
                        <div className="absolute top-full left-0 right-0 bg-background bg-opacity-80 p-2 mt-2 rounded-lg max-h-100 overflow-y-auto custom-scrollbar z-20">
                            <Searchuser searchtext={searchtext} />
                        </div>
                    )}
                </div>
                {topbarItems.map(item => (
                <div onClick={()=>sidebarClickHandler(item.label)} key={item.label+'-top'} className="flex flex-col items-center justify-center hover:text-white cursor-pointer text-gray-400 text-sm mr-1  ">
                        {item.icon}
                    </div>
                ))}
            </div>
        </div>
        </div>
    );
};

export default SideBar;