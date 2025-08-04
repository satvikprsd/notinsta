import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AvatarFallback } from './ui/avatar';
import NotextLogo from "./notinstalogo.png";
import { useChat } from './ChatContext';
import { Button } from './ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { useActiveSideBar } from './SideBarActiveContext';
import { useSearch } from './SearchContext';
import { setChatOrder, setConversations, setLastMsgs } from '@/redux/chatSlice';
import useGetConvo from '@/hooks/useGetConvo';
import useGetSocketConvo from '@/hooks/useGetSocketConvo';
import { Textarea } from './ui/textarea';
import EmojiPicker from 'emoji-picker-react';
import useGetChatOrder from '@/hooks/useGetChatOrder';
import { useLoading } from './LoadingContext';
import { useSocket } from './SocketContext';
import TypingLoader from './ui/typingloader';
import useGetLastMsgs from '@/hooks/useGetLastMsgs';
import { toast } from 'sonner';
const ChatPage = () => {
    const {user, selectedChat} = useSelector(store => store.auth);
    const { onlineUsers, conversations, chatorder, lastMsgs } = useSelector(store=>store.chats);
    const { setChatOpen } = useChat();
    const { setSearchOpen } = useSearch();
    const messagesEndRef = useRef(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {setActiveItem} = useActiveSideBar();
    const [chattext, setChatText] = useState('');
    const [showEmoji, setShowEmoji] = useState(false);
    const [istyping, setIsTyping] = useState(false);
    const textareaRef = useRef(null);
    const ChatPageRef = useRef(null);
    const { chatpageloading, lastmsgloading, typinganimation, setTypingAnimation } = useLoading();
    const { socketio } = useSocket();
    const params = useParams();
    const chatId = params.chatid
    useGetLastMsgs();
    useGetChatOrder();
    useGetSocketConvo();
    useGetConvo(chatId);

    const sendMsgHandler = async (receiverId) => {
        const idbeforeapicall = Math.random().toString(36)
        dispatch(setConversations([...conversations, {_id: idbeforeapicall, sender:{_id: user?._id} , receiver:{_id: receiverId}, message: chattext.trim()}]));
        setChatText('')
        try{
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/message/send/${receiverId}`,{
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({text: chattext.trim()})});
            const data = await response.json();
            if(data.success){
                const newconvesations = conversations.filter((msg)=>msg._id!=idbeforeapicall);
                dispatch(setConversations([...newconvesations, data.newmessage]));
                const filteredOrder = chatorder.filter(chat => chat.chatuser._id !== data.newmessage.receiver._id);
                dispatch(setChatOrder([{chatuser: data.newmessage.receiver, updatedAt: new Date().toISOString()}, ...filteredOrder]))
                const newlastmsg = lastMsgs.map((msg) => msg.participant == receiverId ? {participant: msg.participant, lastMessage: data.newmessage} : msg)
                console.log(newlastmsg, "temp")
                dispatch(setLastMsgs(newlastmsg))
                setChatText('')
            }
            else{
                const failedConversation = conversations.filter((msg)=>msg!=chattext.trim());
                dispatch(setConversations(failedConversation))
                toast.error('Failed to send message');
            }
            
        }
        catch(e){
            console.log(e);
        }
    }

    const handleFocus = () => {
        setTimeout(() => {
        textareaRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "center",
        });
        }, 100);
        ChatPageRef.current?.scrollTo({ top: 0, behavior: "smooth" });
    };

    useEffect(() => {
        const handleResize = () => {
        if (textareaRef.current && document.activeElement === textareaRef.current) {
            setTimeout(() => {
            textareaRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "center",
            });
            }, 100); 
        }
        };

        window.addEventListener("resize", handleResize);
        return () => {
        window.removeEventListener("resize", handleResize);
        };
    }, []);


    useEffect(()=>{
        setActiveItem('Messages');
        socketio?.on('user_typing', (id)=>{
            if (chatId==id.userId) setTypingAnimation(true);
        })
        socketio?.on('user_stopped_typing', (id)=>{
            if (chatId==id.userId) setTypingAnimation(false);
        })
        return ()=>{setActiveItem(null)};
    },[]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
        }

    }, [conversations, typinganimation]);

    useEffect(()=>{
        const timeout = setTimeout(()=>{
            if(istyping) {
                socketio.emit('typing_stopped', (chatId))
                setIsTyping(false)
            }
        }, 2000);

        return () => clearTimeout(timeout);
    }, [chattext])


    useEffect(() => {
        setChatOpen(true);
        return () => setChatOpen(false);
    }, [setChatOpen]);

    if (chatpageloading || lastmsgloading)
    {
        return (<div className="min-h-screen flex-1 my-3 flex flex-col justify-center items-center sm:pl-[94px]">
            <img src={NotextLogo} alt="Description" width="100" className="block my-8 pl-3"/>
        </div>)
    }

  return (
    <div ref={ChatPageRef} onClick={()=>setSearchOpen(false)} className='flex ml-0 fixed md:top-0 top-[47px] md:mt-0 md:ml-[94px] h-[calc(100%-102px)] md:h-screen w-screen md:w-[calc(100%-94px)]'>
        <div className={`${selectedChat && chatId ? 'hidden sm:block' : ''}  flex-none w-full sm:w-[400px] border-r border-gray-600`}>
            <section className='px-5 sm:pl-5 w-full my-7'>
                <h1 className='font-bold mb-4 px-3 text-xl'>{user?.username}</h1>
                <hr className='mx-2 sm:mb-2 border-gray-300' />
                <div  className='overflow-y-auto h-[calc(100vh-90px)] custom-scrollbar'>
                    {
                        chatorder?.map((users) => {
                            const isonline = onlineUsers.includes(users.chatuser?._id);
                            return (
                                <div onClick={()=>{setShowEmoji(false);navigate(`/chat/${users.chatuser?._id}`)}} key={users.chatuser?._id} className={`${chatId == users.chatuser?._id ? 'bg-gray-800' : ''}  grid grid-cols-[60px_3fr] gap-2 items-center my-2 hover:cursor-pointer hover:bg-gray-700 rounded-lg pt-2 px-2`}>
                                    <div className='relative'>
                                        <Avatar className="relative flex size-8 shrink-0 overflow-hidden rounded-full h-15 w-15">
                                            <AvatarImage src={users.chatuser?.profilePic=='default.jpg' ? NotextLogo : users.chatuser?.profilePic} alt="postimg" className='size-full object-cover rounded-lg aspect-square' />
                                            <AvatarFallback>USER</AvatarFallback>
                                        </Avatar>
                                        <div className={`absolute bottom-3   right-0 mt-8 font-semibold rounded-full h-2 w-2 ${isonline ? 'bg-green-400' : 'bg-red-600'}`}></div>
                                    </div>
                                    <div className='text-sm flex flex-col items-start gap-1'>
                                        <h1 className='font-bold'>{users.chatuser?._id == user?._id ? `${user?.username} (You)` : users.chatuser?.username}</h1>
                                    <span className="text-sm text-gray-400 truncate max-w-[200px] block">
                                    {lastMsgs.filter((msg) => msg.participant == users.chatuser?._id)[0]?.lastMessage?.message}
                                    </span>
                                    </div>
                                    <span  className='text-xs hover:cursor-pointer hover:text-white font-bold text-blue-400'></span>
                                </div>
                            )
                        })
                    }
                </div>
            </section>
        </div>
        {(!selectedChat || !chatId ) && 
            <div className='hidden flex-1 sm:flex flex-col gap-5 min-w-0 justify-center items-center'> 
                <svg aria-label="" fill="currentColor" height="96" role="img" viewBox="0 0 96 96" width="96"><title></title><path d="M48 0C21.532 0 0 21.533 0 48s21.532 48 48 48 48-21.532 48-48S74.468 0 48 0Zm0 94C22.636 94 2 73.364 2 48S22.636 2 48 2s46 20.636 46 46-20.636 46-46 46Zm12.227-53.284-7.257 5.507c-.49.37-1.166.375-1.661.005l-5.373-4.031a3.453 3.453 0 0 0-4.989.921l-6.756 10.718c-.653 1.027.615 2.189 1.582 1.453l7.257-5.507a1.382 1.382 0 0 1 1.661-.005l5.373 4.031a3.453 3.453 0 0 0 4.989-.92l6.756-10.719c.653-1.027-.615-2.189-1.582-1.453ZM48 25c-12.958 0-23 9.492-23 22.31 0 6.706 2.749 12.5 7.224 16.503.375.338.602.806.62 1.31l.125 4.091a1.845 1.845 0 0 0 2.582 1.629l4.563-2.013a1.844 1.844 0 0 1 1.227-.093c2.096.579 4.331.884 6.659.884 12.958 0 23-9.491 23-22.31S60.958 25 48 25Zm0 42.621c-2.114 0-4.175-.273-6.133-.813a3.834 3.834 0 0 0-2.56.192l-4.346 1.917-.118-3.867a3.833 3.833 0 0 0-1.286-2.727C29.33 58.54 27 53.209 27 47.31 27 35.73 36.028 27 48 27s21 8.73 21 20.31-9.028 20.31-21 20.31Z"></path></svg>
                {/* Copied from Instagram */}
                <p className='text-2xl'>Your messages</p>
            </div>}
        {selectedChat && chatId && 
        <div className='flex-1 flex flex-col w-[calc(100vw-500px)] overflow-hidden'>
            <div className='flex m-4'>
                <div className='flex gap-3'>
                    <Avatar className="relative flex size-8 shrink-0 overflow-hidden rounded-full h-12 w-12">
                        <AvatarImage src={selectedChat.profilePic=='default.jpg' ? NotextLogo : selectedChat.profilePic} alt="postimg" className='size-full object-cover rounded-lg aspect-square' />
                        <AvatarFallback>USER</AvatarFallback>
                    </Avatar>
                    <div className='text-lg flex flex-col items-center justify-center mb-2'>
                        <h1 className='font-medium'>{selectedChat.username}</h1>
                    </div>
                </div>
            </div>
            <hr />
            <div ref={messagesEndRef} className='flex flex-col overflow-y-auto' style={{ flex: '1 1 auto', minHeight: '0px' }}>
                <div className='flex flex-col items-center mt-10'>
                    <div>
                        <Avatar className="relative flex size-8 shrink-0 overflow-hidden rounded-full h-30 w-30">
                            <AvatarImage src={selectedChat.profilePic=='default.jpg' ? NotextLogo : selectedChat.profilePic} alt="postimg" className='size-full object-cover rounded-lg aspect-square' />
                            <AvatarFallback>USER</AvatarFallback>
                        </Avatar>
                    </div>
                    <div>   
                        <div className='text-lg flex flex-col items-center justify-center mb-2 mt-2'>
                            <h1 className='font-medium'>{selectedChat.username}</h1>
                        </div>
                    </div>
                    <div>
                        <Button onClick={()=>{navigate(`/profile/${selectedChat.username}`)}} className="mt-2 bg-[rgb(54,54,54)] text-white text-md hover:bg-[rgba(54,54,54,0.7)] hover:cursor-pointer">View Profile</Button>
                    </div>
                </div>
                {/* Chats map */}
                <div onClick={()=>{setShowEmoji(false)}} className='flex w-full flex-col gap-2 mt-10' style={{ flex: '1 1 auto', minHeight: '0px' }}>
                    {conversations?.map((msg)=>{
                        return (
                            <div key={msg._id} className={`mx-3 flex ${user._id === msg.sender?._id ? 'justify-end' : 'justify-start'}`}>
                                <div style={user._id !== msg.sender?._id ? { paddingLeft: `calc(${msg.message?.length > 63 ? 15 : 10+msg.message?.length*0.05}px)` } : { paddingLeft: `calc(${msg.message?.length > 63 ? 20 : 10+msg.message?.length*0.1}px)` }} className={`p-2 text-left max-w-xs  xl:max-w-lg break-words text-white  ${user._id === msg.sender?._id ? 'bg-blue-600 rounded-l-4xl rounded-tr-4xl rounded-br-md pl-4' : 'bg-[#333333] rounded-r-4xl rounded-tl-4xl rounded-bl-md'} `}>
                                    {msg?.message}
                                </div>
                            </div>
                        )
                    })}
                    {typinganimation && <div className={`mx-3 flex justify-start`}>
                        <div className={`text-left max-w-xl break-words text-white bg-[#333333] rounded-4xl`}>
                            <TypingLoader className='p-2' />
                        </div>
                    </div>}
                </div>
            </div>
            <div onKeyDown={(e)=>{if(chattext.trim() != '' && e.key=='Enter' && !e.shiftKey){e.preventDefault();sendMsgHandler(selectedChat._id)}}}  className='w-full mt-5 px-4 pb-4 ' style={{ flexShrink: 0 }}>
                <EmojiPicker open={showEmoji} onEmojiClick={(e)=>setChatText(prev=>prev+e.emoji)} className='!fixed !bottom-13 !z-10 mb-2' width={300} height={400} theme='dark' emojiStyle='apple' skinTonesDisabled={true} suggestedEmojisMode='recent' />
                <div className='border-[rgba(255,255,255,0.3)] w-full border-[2px] rounded-4xl px-5 relative flex'>
                    <svg onClick={()=>setShowEmoji(prev=>!prev)} className='fixed bottom-[81px] md:bottom-[26px] hover:cursor-pointer transition-opacity duration-300 active:opacity-70' aria-label="Choose an emoji" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Choose an emoji</title><path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path></svg>
                    <Textarea onFocus={handleFocus} onClick={()=>setShowEmoji(false)} value={chattext} onChange={(e)=>{setChatText(e.target.value);if(!istyping){socketio.emit('typing_started',(chatId));setIsTyping(true);}}} className="w-[95%] ml-6 resize-none !text-md !border-0 !ring-0 !shadow-none focus:!ring-0 focus:!shadow-none focus:!border-0 focus-visible:!ring-0 focus-visible:!shadow-none focus-visible:!border-0 font-normal" style={{ minHeight: '40px', maxHeight: '150px', height: 'auto', overflowY: 'auto', transition: 'height 0.1s ease-out', flexShrink: 0, display: 'block', position: 'relative' }} />
                    {chattext.trim() != '' && <span onClick={()=>sendMsgHandler(selectedChat._id)} className="absolute bottom-[10px] right-[15px] text-blue-500 font-bold hover:cursor-pointer hover:text-white transition-all duration-150 active:translate-y-[2px] active:opacity-70">Send</span>}
                </div>
            </div>
        </div>}
    </div>
  )
}

export default ChatPage