import React from 'react'
import Post from './Post'

const Feed = () => {
  return (
    <div className='h-full flex-1 my-8 flex flex-col items-center pl-[20%]'>
        <div className='h-full'>
          {[1,2,3,4].map((_, index) => (<Post  key={index}/>))}
        </div>
    </div>
  )
}

export default Feed
