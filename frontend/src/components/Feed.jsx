import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Feed = () => {
  const { feed } = useSelector(store=>store.posts);
  return (
    <div className='h-full flex-1 my-8 flex flex-col items-center xl:pl-[20%] md:pl-[8%] sm:pl-0'>
        <div className='h-full'>
          {feed?.map((post) => (<Post  key={post._id} post={post}/>))}
        </div>
    </div>
  )
}

export default Feed
