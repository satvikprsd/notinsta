import React from 'react'
import Post from './Post'
import { useSelector } from 'react-redux'

const Feed = () => {
  const {posts} = useSelector(store=>store.posts);
  return (
    <div className='h-full flex-1 my-8 flex flex-col items-center pl-[20%]'>
        <div className='h-full'>
          {posts.map((post) => (<Post  key={post._id} post={post}/>))}
        </div>
    </div>
  )
}

export default Feed
