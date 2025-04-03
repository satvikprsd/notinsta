import React from 'react'
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogHeader } from './ui/dialog';
import { Button } from './ui/button';

const CreatePost = ({open,setOpen}) => {
    console.log(open);  
   const handleNewPost = async (event) =>{
        event.preventDefault();
        try {
            console
        }
        catch(error){
            console.log(error);
            toast.error(error.message);
        }
   } 
  return (
    <Dialog open={open}>
        <DialogContent onInteractOutside={()=>setOpen(false)} className='max-w-2xl min-h-1/2 focus:outline-none focus:ring-0 bg-[rgb(38,38,38)] flex flex-col items-center'>
            <DialogHeader className='text-xl font-semibold text-center w-full sm:text-center'>Create new post</DialogHeader>
            <form onSubmit={handleNewPost}>
                <Button className='flex'>Select from computer</Button>
            </form>
        </DialogContent>
    </Dialog>
  )
}

export default CreatePost
