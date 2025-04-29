import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'
import Searchuser from './SearchUser';
import { useSearch } from './SearchContext';
import { useLoading } from './LoadingContext';
import NotextLogo from "./notinstalogo.png";

const Feed = () => {
  const { feed } = useSelector(store=>store.posts);
  const { setSearchOpen } = useSearch();
  const { loading } = useLoading();
  return (
    <div onClick={()=>{setSearchOpen(false)}} className='h-full flex-1 my-8 flex flex-col items-center xl:pl-[20%] md:pl-[8%] sm:pl-0'>
        <div className='h-full'>
          {loading ? (<div className="min-h-screen flex-1 my-3 flex flex-col justify-center items-center sm:pl-[20%]">
                      <img src={NotextLogo} alt="Description" width="100" className="block my-8 pl-3"/>
                  </div>) : feed?.length > 0 ? feed?.map((post) => (<Post  key={post._id} post={post}/>)) : (<div className='flex h-screen items-center justify-center'><h1 className='text-2xl'>No posts yet</h1></div>)}
        </div>
    </div>
  )
}

export default Feed
