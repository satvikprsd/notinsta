import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import NotextLogo from "./notinstalogo.png";
import { useSearch } from './SearchContext';
const Searchuser = ({searchtext}) => {
    const [results, setResults] = useState([])
    const { setSearchOpen } = useSearch();
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
        <div className='w-full min-h-[40px] max-h-[400px] text-foreground/80'>
            <div className='overflow-y-auto px-2 pt-2 h-full'>
            {results.length > 0 ? results?.map((users) => {
                return (
                    <Link onClick={()=>{setSearchOpen(false)}} to={`/profile/${users.username}`}>
                        <div key={users._id} className='grid grid-cols-[60px_1.9fr_1fr] items-center my-4 hover:bg-white/10 rounded-lg p-1 cursor-pointer transition-all duration-150 gap-4'>
                            <Avatar className="h-12 w-12">
                                <AvatarImage src={users.profilePic=='default.jpg' ? NotextLogo : users.profilePic} alt="postimg" className='object-cover rounded-lg aspect-square' />
                                <AvatarFallback>USER</AvatarFallback>
                            </Avatar>
                            <div className='text-sm flex flex-col items-start gap-1'>
                                <h1 className='font-bold'>{users.username}</h1>
                                <span className='font-semibold '>{users.name || "NotInsta User"}</span>
                            </div>
                        </div>
                    </Link>
                )})
            : <p className='text-center '>No results found</p>}
            </div>
        </div>
    </div>
    )


}

export default Searchuser