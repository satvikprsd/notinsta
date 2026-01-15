import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { setAuthUser } from '@/redux/authSlice';
import NotextLogo from "./notinstalogo.png";
import { useSearch } from './SearchContext';
import { useLoading } from './LoadingContext';
import SpotifyLogo from './spotifylogo.png';
import useGetCurrentSong from '@/hooks/useGetCurrentSong';

const SuggestionBar = () => {
  const {user, suggestedUsers, currentSong} = useSelector(store=>store.auth);
  const following = user?.following;
  const [isfollowed, setIsFollowed] = useState({});
  const [showAllSuggestions, setShowAllSuggestions] = useState(false);
  const { setSearchOpen } = useSearch();
  const { suggestionloading } = useLoading();
  const dispatch = useDispatch();

  useGetCurrentSong(user?._id, user?.spotify_connected);

  const handleFollow = async (profile) => {
    const profileID = profile._id;
    const {username, profilePic} = profile ;
    setIsFollowed(prev => ({...prev,  [profileID]:!prev[profileID]}))
    try{
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/followorunfollow/${profileID}`,{
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        // console.log(data);
        if(data.success){
            if (isfollowed[profileID]){
              const newfollowing = following.filter((f)=>f._id!=profileID);
              dispatch(setAuthUser({...user, following: newfollowing}));
            }
            else{
              dispatch(setAuthUser({...user, following: [...following, {_id:profileID, username, profilePic} ]}))
            }
            toast.success(isfollowed[profileID] ? "Unfollowed successfully" : "Followed successfully");
          }else{
            setIsFollowed(prev => ({...prev,  [profileID]:!prev[profileID]}))
            toast.error('Failed to Follow/Unfollow');
          }
    }catch(e){
        setIsFollowed(prev => ({...prev,  [profileID]:!prev[profileID]}))
        toast.error(e.message);
        console.log(e);
    }
}

  const visibleSuggestions = showAllSuggestions ? suggestedUsers : suggestedUsers.slice(0, 5);

  return (
    <div onClick={()=>setSearchOpen(false)} className='hidden lg:block w-[25%] px-0 my-10 pr-32' style={{"paddingRight": "30px", "paddingLeft": "10px"}}>
      <div className='flex-col items-center space-y-3 p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg'>
        <div className='flex items-center gap-3'>
            <Link to={`/profile/${user?.username}`}>
              <Avatar className="h-12 w-12">
                  <AvatarImage src={user?.profilePic=='default.jpg' ? NotextLogo : user?.profilePic} alt="postimg" className='object-cover rounded-lg aspect-square' />
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
        {currentSong && <div className="box boxanimation hidden sm:flex gap-2">
            <img
                className="rounded-lg mr-4"
                src={currentSong.album.images[0].url}
                alt={`Album cover of ${currentSong.album.name}`}
                width={50}
                height={50}
            />
            <div>
                <div className="flex gap-2 items-center">
                    <p className="font-bold text-xl text-[#333]">Now playing:</p>
                    <div className="playing">
                        <div className="greenline line-1"></div>
                        <div className="greenline line-2"></div>
                        <div className="greenline line-3"></div>
                        <div className="greenline line-4"></div>
                        <div className="greenline line-5"></div>
                    </div>
                </div>
                <a
                className="link block max-w-[200px] truncate"
                href={currentSong.external_urls.spotify}
                target="_blank"
                rel="noopener noreferrer"
                >
                {currentSong.name} by {currentSong.artists.map((artist) => artist.name).join(', ')}
                </a>
            </div>
            
        </div>}
      </div>


      <div className='my-10 min-w-[270px] p-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg'>
        <div className='flex items-center justify-between text-sm'>
          <h1 className='font-semibold text-gray-400'>Suggested for you</h1>
          <span onClick={()=>setShowAllSuggestions(prev=>!prev)} className='font-bold text-white hover:cursor-pointer hover:text-blue-400 transition-colors duration-200'>{showAllSuggestions?'See less' : 'See more'}</span>
        </div>
        {suggestionloading ? (<div className="min-h-[300px] flex-1 flex flex-col justify-center items-center">
                              <img src={NotextLogo} alt="Description" width="80" className="block"/>
                          </div>) :
        visibleSuggestions?.length > 0 ?
          visibleSuggestions?.map((users, idx) => {
             return (
              <div key={users._id} className={`grid grid-cols-[60px_1.9fr_auto] items-center ${idx === visibleSuggestions.length - 1 ? 'mt-4' : 'my-4'} p-2 rounded-xl hover:bg-white/10 transition-all duration-200`}>
                <Link to={`/profile/${users.username}`}>
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={users.profilePic=='default.jpg' ? NotextLogo : users.profilePic} alt="postimg" className='object-cover rounded-lg aspect-square' />
                    <AvatarFallback>USER</AvatarFallback>
                  </Avatar>
                </Link>
                <Link to={`/profile/${users.username}`}>
                  <div className='text-sm flex flex-col items-start gap-1'>
                      <h1 className='font-bold'>{users.username}</h1>
                    <span className='font-semibold text-gray-600'>{users.name || "NotInsta User"}</span>
                  </div>
                </Link>
                <span onClick={()=>{handleFollow(users)}} className='text-xs hover:cursor-pointer hover:text-white font-bold text-blue-400'>{isfollowed[users._id] ? "Following" : "Follow"}</span>
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
