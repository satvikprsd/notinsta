import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Link, useParams, useSearchParams } from "react-router-dom";
import useGetProfile from "@/hooks/useGetProfile";
import { Heart, MessageCircle, Search, XIcon } from "lucide-react";
import { Dialog, DialogContent } from "./ui/dialog";
import PostDialog from "./PostDialog";
import { toast } from "sonner";
import { setAuthUser, setCurrentSong, setProfile } from "@/redux/authSlice";
import ChangePfp from "./ChangePfp";
import UpdateProfile from "./EditProfile";
import { useNavigate } from "react-router-dom";
import NotextLogo from "./notinstalogo.png";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Input } from "./ui/input";
import { useLoading } from "./LoadingContext";
import useGetUser from "@/hooks/useGetUser";
import { useActiveSideBar } from "./SideBarActiveContext";
import NotFound from "./NotFound";
import useGetCurrentSong from "@/hooks/useGetCurrentSong";
import SpotifyLogo from "./spotifylogo.png";

const FollowersDialog = ({openfollowerdialog, setOpenFollowerDialog, followers, isfollowerfollowed, setIsFollowerFollowed, dispatch ,user , profile}) => {
    const [searchfollowers, setSearchFollowers] = useState(followers);
    const [searchtext, setSearchText] = useState('');
    useEffect(()=>{
        const timer = setTimeout(()=>{
            if (!searchtext) {
                setSearchFollowers(followers);
            }else {
                const newfollowing = followers.filter((f)=>f.username.toLowerCase().includes(searchtext.toLowerCase()))
                // console.log(newfollowing,"newfollwing");
                setSearchFollowers(newfollowing);
            }
        },300)
        return () => {
            clearTimeout(timer)
        };
    },[searchtext, followers])

    const handleFollow = async (followprofile) => {
        const profileID = followprofile._id;
        setIsFollowerFollowed(prev => ({...prev,  [profileID]:!prev[profileID]}))
        try{
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/followorunfollow/${profileID}`,{
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            // console.log(data);
            if(data.success){
                if (isfollowerfollowed[profileID]){
                    const newfollowing = user?.following.filter((f)=>f._id!=profileID)
                    dispatch(setAuthUser({...user, following: newfollowing}))
                    if(user._id == profile._id) dispatch(setProfile({...profile, following: newfollowing}))
                }
                else{
                    const {_id, username, profilePic} = followprofile;
                    dispatch(setAuthUser({...user, following:[...user.following, {_id,username,profilePic}]}))
                    if(user._id == profile._id) dispatch(setProfile({...profile, following:[...user.following, {_id,username,profilePic}]}))
                }
                toast.success(isfollowerfollowed[profileID] ? "Unfollowed successfully" : "Followed successfully");
              }else{
                setIsFollowerFollowed(prev => ({...prev,  [profileID]:!prev[profileID]}))
                toast.error(data.message);

              }
        }catch(e){
            setIsFollowerFollowed(prev => ({...prev,  [profileID]:!prev[profileID]}))
            toast.error(e.message);
            console.log(e);
        }
    }
    return (
        <Dialog open={openfollowerdialog}>
            <DialogContent className="flex flex-col pt-3 px-0 w-sm max-w-[90%] max-h-[50vh] focus:outline-none focus:ring-0" onInteractOutside={()=> setOpenFollowerDialog(false)}>
                <div className="w-full flex items-center justify-between">
                    <div className="w-full flex-1 text-center font-bold">
                        <DialogTitle>Followers</DialogTitle>
                    </div>
                    <XIcon onClick={()=>setOpenFollowerDialog(false)} className="absolute right-4 hover:cursor-pointer"/>
                </div>
                <hr className="border-t-2 p-0"/>
                <div className="relative flex items-center justify-center">
                    <Search className="absolute left-6 w-5 h-5 search-icon"/>
                    <Input value={searchtext} onChange={(e)=>setSearchText(e.target.value.trim())} className={`w-[90%] h-[120%] ${searchtext ? 'pl-2' : 'pl-7'} focus:pl-2`} placeholder="Search" 
                    onFocus={() => document.querySelector('.search-icon').classList.add('hidden')} 
                    onBlur={() => {if(!searchtext) document.querySelector('.search-icon').classList.remove('hidden')}}/>
                </div>
                <div className="flex flex-col overflow-y-auto custom-scrollbar">
                    {searchfollowers?.map((f)=> {return (
                        <div key={f._id} className='grid grid-cols-[60px_1.9fr_1fr] items-center my-4 px-5'>
                        <Link onClick={()=>openfollowerdialog(false)} to={`/profile/${f.username}`}>
                            <Avatar className="h-12 w-12">
                            <AvatarImage src={f.profilePic} alt="postimg" className='object-cover rounded-lg aspect-square' />
                            <AvatarFallback>USER</AvatarFallback>
                            </Avatar>
                        </Link>
                        <div className='text-sm flex flex-col items-start gap-1'>
                            <Link onClick={()=>openfollowerdialog(false)} to={`/profile/${f.username}`}>
                            <h1 className='font-bold'>{f.username}</h1>
                            </Link>
                        </div>
                        <Button onClick={()=>{handleFollow(f)}} className='text-xs hover:cursor-pointer bg-gray-800 hover:bg-gray-900 font-bold text-white'>{f._id===user._id ? 'You' : isfollowerfollowed[f._id] ? "Following" : "Follow"}</Button>
                        </div>
                    )})}
                </div>
            </DialogContent>
        </Dialog>
    );
}

const FollowingDialog = ({openfollowingdialog, setOpenFollowingDialog, followings, isfollowingfollowed, setIsFollowingFollowed, dispatch ,user}) => {
    const [searchfollowings, setSearchFollowings] = useState(followings);
    const [searchtext, setSearchText] = useState('');

    useEffect(()=>{
        const timer = setTimeout(()=>{
            if (!searchtext) {
                setSearchFollowings(followings);
            }else {
                const newfollowing = followings.filter((f)=>f.username.toLowerCase().includes(searchtext.toLowerCase()))
                // console.log(newfollowing,"newfollwing");
                setSearchFollowings(newfollowing);
            }
        },300)
        return () => {
            clearTimeout(timer)
        };
    },[searchtext, followings])

    const handleFollow = async (profile) => {
        const profileID = profile._id;
        setIsFollowingFollowed(prev => ({...prev,  [profileID]:!prev[profileID]}))
        try{
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/followorunfollow/${profileID}`,{
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            // console.log(data);
            if(data.success){
                if (isfollowingfollowed[profileID]){
                    const newfollowing = user?.following.filter((f)=>f._id!=profileID)
                    dispatch(setAuthUser({...user, following: newfollowing}))
                }
                else{
                    const {_id, username, profilePic} = profile;
                    dispatch(setAuthUser({...user, following:[...user.following, {_id,username,profilePic}]}))
                }
                toast.success(isfollowingfollowed[profileID] ? "Unfollowed successfully" : "Followed successfully");
              }else{
                setIsFollowingFollowed(prev => ({...prev,  [profileID]:!prev[profileID]}))
                toast.error(data.message);
              }
        }catch(e){
            setIsFollowingFollowed(prev => ({...prev,  [profileID]:!prev[profileID]}))
            toast.error(e.message);
            console.log(e);
        }
    }
    return (
        <Dialog open={openfollowingdialog}>
            <DialogContent className="flex flex-col pt-3 px-0 w-sm max-w-[90%] max-h-[50vh] focus:outline-none focus:ring-0" onInteractOutside={()=> setOpenFollowingDialog(false)}>
                <div className="w-full flex items-center justify-between">
                    <div className="w-full flex-1 text-center font-bold">
                        <DialogTitle>Following</DialogTitle>
                    </div>
                    <XIcon onClick={()=>setOpenFollowingDialog(false)} className="absolute right-4 hover:cursor-pointer"/>
                </div>
                <hr className="border-t-2 p-0"/>
                <div className="relative flex items-center justify-center">
                    <Search className="absolute left-6 w-5 h-5 search-icon"/>
                    <Input value={searchtext} onChange={(e)=>setSearchText(e.target.value.trim())} className={`w-[90%] h-[120%] ${searchtext ? 'pl-2' : 'pl-7'} focus:pl-2`} placeholder="Search" 
                    onFocus={() => document.querySelector('.search-icon').classList.add('hidden')} 
                    onBlur={() => {if(!searchtext) document.querySelector('.search-icon').classList.remove('hidden')}}/>
                </div>
                <div className="flex flex-col overflow-y-auto custom-scrollbar">
                    {searchfollowings?.map((f)=> {return (
                        <div key={f._id} className='grid grid-cols-[60px_1.9fr_1fr] items-center my-4 px-5'>
                        <Link onClick={()=>openfollowingdialog(false)} to={`/profile/${f.username}`}>
                            <Avatar className="h-12 w-12">
                            <AvatarImage src={f.profilePic} alt="postimg" className='object-cover rounded-lg aspect-square' />
                            <AvatarFallback>USER</AvatarFallback>
                            </Avatar>
                        </Link>
                        <div className='text-sm flex flex-col items-start gap-1'>
                            <Link onClick={()=>openfollowingdialog(false)} to={`/profile/${f.username}`}>
                            <h1 className='font-bold'>{f.username}</h1>
                            </Link>
                        </div>
                        <Button onClick={()=>{handleFollow(f)}} className='text-xs hover:cursor-pointer bg-gray-800 hover:bg-gray-900 font-bold text-white'>{f._id===user._id ? 'You' : isfollowingfollowed[f._id] ? "Following" : "Follow"}</Button>
                        </div>
                    )})}
                </div>
            </DialogContent>
        </Dialog>
    );
}

const Profile = () => {
    const [openPostDialog, setOpenPostDialog] = useState(false);
    const [openPfpDialog, setopenPfpDialog] = useState(false);
    const [openEditDialog, setopenEditDialog] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [postorsaved, setPostOrSaved] = useState(true);
    const navigate = useNavigate();
    const params = useParams();
    const userId = params.username;
    const { userloading, profileloading } = useLoading();
    console.log(userloading,profileloading)
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();
    const { profile,user,savedPosts, currentSong } = useSelector((store) => store.auth);
    if (!params.username) {
        navigate(`/profile/${user?.username}`)
        if (searchParams.get("connected")) {
            toast.success("Spotify connected successfully");
        }
    }
    useGetUser(user?.username);
    useGetProfile(userId);
    useGetCurrentSong(profile?._id, profile?.spotify_connected);
    
    const [isfollowed, setIsFollowed] = useState(profile?.followers?.map((f)=>f._id).includes(user?._id));
    const [isfollowerfollowed, setIsFollowerFollowed] = useState({});
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [isfollowingfollowed, setIsFollowingFollowed] = useState({});
    const [openfollowerdialog, setOpenFollowerDialog] = useState(false);
    const [openfollowingdialog, setOpenFollowingDialog] = useState(false);
    const followers = profile?.followers;
    const followings = profile?.following;
    const {activeItem, setActiveItem} = useActiveSideBar();
    useEffect(()=>{
        setActiveItem("Profile");
        return ()=>{setActiveItem(null)}
    },[])
    useEffect(()=>{
        // console.log('profile refetch')
        setIsFollowed(profile?.followers?.map((f)=>f._id).includes(user?._id));
    },[userloading,profileloading])

    useEffect(() => {
        if (selectedPost) {
          if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
            navigate(`/p/${selectedPost._id}`);
          } 
        }
      }, [selectedPost, openPostDialog]);

    const getfollowers = () => {
        const followingIDs = new Set(user?.following?.map(f => f._id));
        const followedStatus = {};
        profile?.followers?.forEach(f => {
          followedStatus[f._id] = followingIDs.has(f._id);
        });
        setIsFollowerFollowed(followedStatus);
        setOpenFollowerDialog(true)
    }

    const getfollowings = () => {
        const followingIDs = new Set(user?.following?.map(f => f._id));
        const followedStatus = {};
        profile?.following?.forEach(f => {
          followedStatus[f._id] = followingIDs.has(f._id);
        });
        // console.log(user.following,profile.following,followedStatus, "idontcare")
        setIsFollowingFollowed(followedStatus);
        setOpenFollowingDialog(true)
    }

    const handleFollow = async () => {
        setIsFollowed(prev=>!prev); 
        try{
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/followorunfollow/${profile._id}`,{
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            if(data.success){  
                const { _id: userId, username: userUsername, profilePic: userProfilePic } = user;
                let newfollowers = isfollowed ? profile?.followers.filter((f)=> f._id!=user?._id) : [...profile.followers, { _id: userId, username: userUsername, profilePic: userProfilePic }]
                const { _id: profileId, username: profileUsername, profilePic: profileProfilePic } = profile;
                let usernewfollowing = isfollowed ? user?.following.filter((f)=> f._id!=profile?._id) : [...user.following, { _id: profileId, username: profileUsername, profilePic: profileProfilePic }]
                // console.log(usernewfollowing, "new folllowing")
                dispatch(setProfile({...profile, followers : newfollowers}))
                dispatch(setAuthUser({...user, following: usernewfollowing}))
                toast.success(isfollowed ? "Unfollowed successfully" : "Followed successfully");
              }else{
                setIsFollowed(prev=>!prev); 
                toast.error('Failed to Follow/Unfollow');
              }
        }catch(e){
            setIsFollowed(prev=>!prev); 
            toast.error(e.message);
            console.log(e);
        }
    }

    if (userloading || profileloading)
    {
        return (<div className="min-h-screen flex-1 my-3 flex flex-col justify-center items-center sm:pl-[20%]">
            <img src={NotextLogo} alt="Description" width="100" className="block my-8 pl-3"/>
        </div>)
    }

    if (!profile) {
        return (
            <div className="min-h-screen flex-1 flex flex-col items-center md:pl-[10%] lg:pl-[20%]">
                <NotFound />
            </div>
        )
        
    }

    return (
        <div className="min-h-screen flex-1 flex flex-col items-center md:pl-[10%] lg:pl-[20%]">
            <div className="w-full flex items-start mt-15 md:mt-10 mb-2 p-2 pl-5 md:pl-[10%] lg:pl-[13%]">
                <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
                    <DialogContent className="flex flex-col items-center justify-center p-6 w-[300px]">
                        <DialogTitle className="text-lg font-bold mb-4">Spotify Connection</DialogTitle>
                        <p className="text-base text-center text-gray-600 mb-6">Are you sure you want to disconnect your Spotify account?</p>
                        <div className="flex gap-4">
                            <Button className="hover:cursor-pointer" variant="outline" onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
                            <Button className="bg-red-500 text-white hover:cursor-pointer" onClick={async () => {
                                try {
                                    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/spotify-disconnect`, {
                                        method: 'GET',
                                        credentials: 'include',
                                    });
                                    const data = await response.json();
                                    if (data.success) {
                                        dispatch(setAuthUser({ ...user, spotify_connected: false, expires_at: null }));
                                        if (profile?._id === user?._id) {
                                            dispatch(setProfile({ ...profile, spotify_connected: false, expires_at: null }));
                                            dispatch(setCurrentSong(null));
                                        }
                                        toast.success("Spotify disconnected successfully");
                                    }
                                    else {
                                        toast.error(data.message);
                                    }
                                }
                                catch (error) {
                                    console.error("Error disconnecting Spotify:", error);
                                    toast.error("Failed to disconnect Spotify");
                                }
                                setConfirmDialogOpen(false);
                            }}>Disconnect</Button>
                        </div>
                    </DialogContent>  
                </Dialog>
                {user && <FollowersDialog openfollowerdialog={openfollowerdialog} setOpenFollowerDialog={setOpenFollowerDialog} followers={followers} isfollowerfollowed={isfollowerfollowed} setIsFollowerFollowed={setIsFollowerFollowed} dispatch={dispatch} user={user} profile={profile} />}
                {user && <FollowingDialog openfollowingdialog={openfollowingdialog} setOpenFollowingDialog={setOpenFollowingDialog} followings={followings} isfollowingfollowed={isfollowingfollowed} setIsFollowingFollowed={setIsFollowingFollowed} dispatch={dispatch} user={user} />}
                <ChangePfp open={openPfpDialog} setOpen={setopenPfpDialog} />
                <div className="flex items-center justify-center h-full">
                    <Avatar onClick={()=>{if(profile?._id==user?._id) setopenPfpDialog(true)}} className={`h-25 w-25 sm:h-40 sm:w-40 ${profile?._id==user?._id ? 'hover:cursor-pointer' : ''}`}>
                        <AvatarImage src={profile?.profilePic=='default.jpg' ? NotextLogo : profile?.profilePic} alt="postimg" className='object-cover rounded-lg aspect-square' />
                        <AvatarFallback>User</AvatarFallback>
                    </Avatar>
                </div>
                <div className="flex flex-col gap-5 mx-5 sm:mx-20">
                    <div className="flex flex-col sm:flex-row gap-5">
                        <h1 className="text-xl ">{profile?.username}</h1>
                        <UpdateProfile open={openEditDialog} setOpen={setopenEditDialog} />
                        <div className="flex gap-2">
                            {!user ? (<Button onClick={()=>navigate('/login')} className="bg-blue-400 text-white text-sm h-8">Login to Follow</Button>) : profile?._id==user?._id ? (<Button className='bg-[#363636] text-white text-sm sm:text-base h-8 hover:cursor-pointer' onClick={()=>{setopenEditDialog(true)}}>Edit profile</Button>) : (<Button onClick={()=>handleFollow()} className={`${isfollowed ? 'bg-[#363636]' : 'bg-blue-400'} text-white text-base h-8`}>{isfollowed ? "Following" : "Follow"}</Button>)}
                            {profile?._id==user?._id && <div>
                                {user?.spotify_connected ?
                                        <Button className='bg-[#65D370] text-black text-sm md:text-base h-8 hover:cursor-pointer'
                                                onClick={() => {
                                                    setConfirmDialogOpen(true);
                                                }}
                                            >
                                        Connected
                                        </Button>
                                    :
                                    <Button className='bg-[#65D370] text-black text-sm md:text-base h-8 hover:cursor-pointer'
                                    onClick={() => {
                                        const clientId = import.meta.env.VITE_PUBLIC_SPOTIFY_CLIENT_ID;
                                        const redirectUri = "https://notinsta-production.up.railway.app/api/v1/user/spotify-connect";
                                        const scope = "user-read-currently-playing user-read-playback-state";
                                        const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
                                        redirectUri
                                        )}&scope=${encodeURIComponent(scope)}`;
                                        window.location.href = authUrl;
                                    }}
                                    >
                                    Connect Spotify
                                    </Button>
                                }
                            </div>}
                            {isfollowed && (<Button onClick={()=>navigate(`/chat/${profile?._id}`)} className='bg-[#363636] text-white text-base h-8'>Message</Button>)}
                        </div>
                    </div>
                    <div className="hidden sm:flex gap-5 sm:gap-10">
                        <div className="flex">
                            <p className="font-medium">{profile?.posts.length}</p>
                            <span className="mx-2 text-gray-400">posts</span>
                        </div>
                        <div onClick={()=>getfollowers()} className="flex hover:cursor-pointer">
                            <p className="font-medium">{profile?.followers.length}</p>
                            <span className="mx-2 text-gray-400">followers</span>
                        </div>
                        <div onClick={()=>getfollowings()} className="flex hover:cursor-pointer">
                            <p className="font-medium">{profile?.following.length}</p>
                            <span className="mx-2 text-gray-400">following</span>
                        </div>
                    </div>
                    <div className="hidden sm:flex flex-col self-start gap-1">
                        <h1 className="font-bold">{profile?.name}</h1>
                        <p>{profile?.bio}</p>
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
                        
                        <img className='logo' width={50} height={50} src={SpotifyLogo} alt='' />
                    </div>}
                </div>
            </div>
            <div className="w-full pl-5 items-start flex flex-col sm:hidden gap-1 mb-5">
                        <h1 className="font-bold">{profile?.name}</h1>
                        <p>{profile?.bio}</p>
                        {currentSong && <div className="box boxanimation flex sm:hidden gap-2 mt-1">
                        <img
                            className="rounded-lg mr-4"
                            src={currentSong.album.images[0].url}
                            alt={`Album cover of ${currentSong.album.name}`}
                            width={50}
                            height={40}
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
                        <img className='logo' width={50} height={50} src={SpotifyLogo} alt='' />
                    </div>}
            </div>
            <div className="flex sm:hidden gap-10">
                        <div className="flex">
                            <p className="font-medium">{profile?.posts.length}</p>
                            <span className="mx-2 text-gray-400">posts</span>
                        </div>
                        <div onClick={()=>getfollowers()} className="flex">
                            <p className="font-medium">{profile?.followers.length}</p>
                            <span className="mx-2 text-gray-400">followers</span>
                        </div>
                        <div onClick={()=>getfollowings()} className="flex">
                            <p className="font-medium">{profile?.following.length}</p>
                            <span className="mx-2 text-gray-400">following</span>
                        </div>
            </div>
            <div className="flex items-center w-full pt-5">
                <hr className="text-white w-full"/>
            </div>
            {profile?._id==user?._id ?
            <div className="flex items-center justify-between gap-10">
                <Button onClick={()=>setPostOrSaved(true)} className={`bg-transparent text-white hover:cursor-pointer hover:bg-transparent ${postorsaved ? 'border-t-4 border-white' : ''}`}>POSTS</Button>
                <Button onClick={()=>setPostOrSaved(false)} className={`bg-transparent text-white hover:cursor-pointer hover:bg-transparent ${postorsaved ? '' : 'border-t-4 border-white'}`}>SAVED</Button>
            </div>
            : <></>
            }
            <div className="grid my-10 grid-cols-3 gap-1 items-center pb-10 pr-1">
                {postorsaved ? profile?.posts.length > 0 ? profile?.posts.map((post) => {
                    return (
                        <div onClick={() => {setSelectedPost(post);setOpenPostDialog(true);}} key={post._id} className="relative aspect-[3/4] max-w-[300px] group hover:cursor-pointer overflow-hidden">
                            <img src={post.image.split('/')[4] == 'image' ? post.image : post.image.replace('/upload/', '/upload/so_2.5/').replace('.mp4', '.jpg')} alt="postimg" className="object-cover w-full h-full group-hover:opacity-70 "/>
                            <div className="absolute flex items-center justify-center bottom-0 left-0 h-full w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex gap-5 text-white">
                                <div className="flex items-center">
                                    <Heart fill="white" />
                                    <span className="font-bold mx-2">{post?.likes.length}</span>
                                </div>
                                <div className="flex items-center">
                                    <MessageCircle fill="white" />
                                    <span className="font-bold mx-2">{post.comments.length}</span>
                                </div>
                                </div>
                            </div>
                        </div>
                    );
                }) : (<div className='col-start-2'><h1 className='text-2xl'>No posts yet</h1></div>)
                : savedPosts?.length > 0 ? savedPosts?.map((post) => {
                    return (
                        <div onClick={() => {setSelectedPost(post);setOpenPostDialog(true);}} key={post._id} className="relative aspect-[3/4] max-w-[300px] group hover:cursor-pointer overflow-hidden">
                            <img src={post.image.split('/')[4] == 'image' ? post.image : post.image.replace('/upload/', '/upload/so_2.5/').replace('.mp4', '.jpg')} alt="postimg" className="object-cover w-full h-full group-hover:opacity-70 "/>
                            <div className="absolute flex items-center justify-center bottom-0 left-0 h-full w-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <div className="flex gap-5 text-white">
                                <div className="flex items-center">
                                    <Heart fill="white" />
                                    <span className="font-bold mx-2">{post?.likes.length}</span>
                                </div>
                                <div className="flex items-center">
                                    <MessageCircle fill="white" />
                                    <span className="font-bold mx-2">{post.comments.length}</span>
                                </div>
                                </div>
                            </div>
                        </div>
                    );
                }) : (<div className='col-start-2'><h1 className='text-2xl'>No saved posts yet</h1></div>)
                }
                {selectedPost && window.innerWidth > 1024 && (
                    <Dialog open={openPostDialog} onOpenChange={setOpenPostDialog}>
                        <DialogContent
                        className='max-w-6xl p-0 flex items-center lg:items-stretch flex-col focus:outline-none focus:ring-0'
                        onInteractOutside={() => setOpenPostDialog(false)}
                        >
                        <PostDialog setOpenPostDialog={setOpenPostDialog} post={selectedPost} />
                        </DialogContent>
                    </Dialog>
                )}
            </div>
        </div>
    );
};

export default Profile;