import React, { useState } from 'react'
import { Dialog, DialogContent, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { MoreHorizontal } from 'lucide-react'

const HelpDialog = () => {
const [openhelp, setOpenhelp] = useState(false)
  return (
    <Dialog open={openhelp}>
        <DialogTrigger onClick={()=>setOpenhelp(true)} asChild><MoreHorizontal className='cursor-pointer' /></DialogTrigger>
        <DialogContent className="w-[300px] px-0 py-2" onInteractOutside={()=>setOpenhelp(false)}>
            <div className='flex flex-col gap-2'>
                <Button className='bg-background text-red-600 hover:bg-[rgba(255,255,255,0.1)] cursor-pointer border-0'>Report</Button>
                <hr/>
                <Button className='bg-background text-white hover:bg-[rgba(255,255,255,0.1)] cursor-pointer border-0 '>Go to Post</Button>
                <hr/>
                <Button className='bg-background text-white hover:bg-[rgba(255,255,255,0.1)] cursor-pointer border-0'>View Profile</Button>
                <hr/>
                <Button className='bg-background text-white hover:bg-[rgba(255,255,255,0.1)] cursor-pointer border-0'>Copy Link</Button>
                <hr/>
                <Button className='bg-background text-white hover:bg-[rgba(255,255,255,0.1)] cursor-pointer border-0'>Add to Saved</Button>
                <hr/>
                <Button onClick={()=>setOpenhelp(false)} className='bg-background text-white hover:bg-[rgba(255,255,255,0.1)] cursor-pointer border-0'>Close</Button>
            </div>
        </DialogContent>
    </Dialog>
  )
}

export default HelpDialog