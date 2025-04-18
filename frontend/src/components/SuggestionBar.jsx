import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

const SuggestionBar = () => {
  const {user, suggestedUsers} = useSelector(store=>store.auth);
  const [isfollowed, setIsFollowed] = useState({});
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const handleFollow = async (userID) => {
    try{
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/followorunfollow/${userID}`,{
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        if(data.success){
            setIsFollowed(prev => ({...prev,  [userID]:!prev[userID]}))
            toast.success(isfollowed[userID] ? "Unfollowed successfully" : "Followed successfully");
          }else{
            toast.error('Failed to Follow/Unfollow');
          }
    }catch(e){
        toast.error(e.message);
        console.log(e);
    }
}

  const visibleSuggestions = showAllSuggestions ? suggestedUsers : suggestedUsers.slice(0, 5);

  return (
    <div className='hidden lg:block w-[25%] px-0 my-10 pr-32' style={{"padding-right": "30px", "padding-left": "10px"}}>
      <div className='flex items-center gap-3'>
          <Link to={`/profile/${user?.username}`}>
            <Avatar className="h-12 w-12">
                <AvatarImage src={user?.profilePic} alt="postimg" className='object-cover rounded-lg aspect-square' />
                <AvatarFallback>USER</AvatarFallback>
            </Avatar>
          </Link>
          <div className='text-sm flex flex-col items-start gap-1'>
            <Link to={`/profile/${user?.username}`}>
              <h1 className='font-bold'>{user?.username}</h1>
            </Link>
            <span className='font-semibold text-gray-600'>{user?.name || "NotInsta User"}</span>
          </div>
      </div>


      <div className='my-10'>
        <div className='flex items-center gap-25 text-sm'>
          <h1 className='font-semibold text-gray-600'>Suggested for you</h1>
          <span onClick={()=>setShowAllSuggestions(prev=>!prev)} className='font-bold text-white hover:cursor-pointer'>{showAllSuggestions?'See less' : 'See more'}</span>
        </div>
        {visibleSuggestions?.length > 0 ?
          visibleSuggestions?.map((user) => {
             return (
              <div key={user._id} className='grid grid-cols-[60px_1.9fr_1fr] items-center my-4'>
                <Link to={`/profile/${user.username}`}>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={user.profilePic} alt="postimg" className='object-cover rounded-lg aspect-square' />
                    <AvatarFallback>USER</AvatarFallback>
                  </Avatar>
                </Link>
                <div className='text-sm flex flex-col items-start gap-1'>
                  <Link to={`/profile/${user.username}`}>
                    <h1 className='font-bold'>{user.username}</h1>
                  </Link>
                  <span className='font-semibold text-gray-600'>{user.name || "NotInsta User"}</span>
                </div>
                <span onClick={()=>{handleFollow(user._id)}} className='text-xs hover:cursor-pointer hover:text-white font-bold text-blue-400'>{isfollowed[user._id] ? "Following" : "Follow"}</span>
              </div>
            )
          })
          : (<h2>No one new to follow</h2>)
        }
      </div>
    </div>
  )
}

export default SuggestionBar
