import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Feed = () => {
  const { feed } = useSelector(store=>store.posts);
  return (
    <div className='h-full flex-1 my-8 flex flex-col items-center xl:pl-[20%] md:pl-[8%] sm:pl-0'>
        <div className='h-full'>
          {feed?.length > 0 ? feed?.map((post) => (<Post  key={post._id} post={post}/>)) : (<div className='flex h-screen items-center justify-center'><h1 className='text-2xl'>No posts yet</h1></div>)}
        </div>
    </div>
  )
}

export default Feed
