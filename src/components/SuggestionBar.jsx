import React from 'react'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';

const SuggestionBar = () => {
  const {user, suggestedUsers} = useSelector(store=>store.auth);
  return (
    <div className='w-[25%] px-0 my-10 pr-32' style={{"padding-right": "30px", "padding-left": "10px"}}>
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
          <span className='font-bold text-white'>See all</span>
        </div>
        {
          suggestedUsers.map((user) => {
             return (
              <div key={user._id} className='flex items-center gap-3 my-4'>
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
                <span className='mx-15 text-xs hover:cursor-pointer hover:text-white font-bold text-blue-400'>Follow</span>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}

export default SuggestionBar
