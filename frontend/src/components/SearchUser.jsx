import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import NotextLogo from "./notinstalogo.png";
import { useSearch } from './SearchContext';
const Searchuser = ({searchtext}) => {
    const [results, setResults] = useState([])
    const { searchOpen, setSearchOpen } = useSearch();
    const fetchsearch = async () => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/search/${searchtext}`, {credentials: 'include'})
        const data = await response.json()
        setResults(data.users);
    }

    useEffect(() => {
        if(!searchtext) setResults([])
        const timer = setTimeout(()=>{
            if(searchtext) fetchsearch();
        },500);
        return () => {
            clearTimeout(timer)
        };
    },[searchtext])
    return (
    <div className=''>
        <hr />
        <div className='w-full h-full bg-background'>
            <div className='overflow-y-auto px-2 pt-2 h-full'>
            {results?.map((users) => {
                return (
                    <div key={users._id} className='grid grid-cols-[60px_1.9fr_1fr] items-center my-4'>
                        <Link onClick={()=>{setSearchOpen(false)}} to={`/profile/${users.username}`}>
                            <Avatar className="h-12 w-12">
                            <AvatarImage src={users.profilePic=='default.jpg' ? NotextLogo : users.profilePic} alt="postimg" className='object-cover rounded-lg aspect-square' />
                            <AvatarFallback>USER</AvatarFallback>
                            </Avatar>
                        </Link>
                        <div className='text-sm flex flex-col items-start gap-1'>
                            <Link onClick={()=>setSearchOpen(false)} to={`/profile/${users.username}`}>
                            <h1 className='font-bold'>{users.username}</h1>
                            </Link>
                            <span className='font-semibold text-gray-600'>{users.name || "NotInsta User"}</span>
                        </div>
                    </div>
                )})
            }
            </div>
        </div>
    </div>
    )


}

export default Searchuser