import React from 'react'

const Comment = () => {
  return (
    <div className='flex items-center justify-between p-4'>
        <div className='flex items-center gap-3'>
            <Avatar>
                <AvatarImage src={post.author?.profilePic} alt="postimg" className='object-cover rounded-lg aspect-square' />
                <AvatarFallback>Post</AvatarFallback>
            </Avatar>
            <h1>{post.author?.username}</h1>
        </div>
        <p></p>
    </div>
  )
}

export default Comment