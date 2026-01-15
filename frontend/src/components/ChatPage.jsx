import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AvatarFallback } from './ui/avatar';
import NotextLogo from "./notinstalogo.png";
import { useChat } from './ChatContext';
import { Button } from './ui/button';
import { Link, useNavigate, useParams } from 'react-router-dom';
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
    const { ChatPageRef } = useChat();
    const { chatpageloading, typinganimation, setTypingAnimation } = useLoading();
    const { socketio } = useSocket();
    const params = useParams();
    const chatId = params.chatid
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
                dispatch(setConversations([...newconvesations, data.newMessage]));
                const filteredOrder = chatorder.filter(chat => chat.chatuser._id !== data.newMessage.receiver._id);
                dispatch(setChatOrder([{chatuser: data.newMessage.receiver, updatedAt: new Date().toISOString()}, ...filteredOrder]))
                console.log(lastMsgs, "newlastmsg")
                const newlastmsg = lastMsgs.map((msg) => msg?.receiver == receiverId ? {...data.newMessage, receiver: data.newMessage.receiver._id, sender: data.newMessage.sender._id}: msg)
                console.log(newlastmsg, "newlastmsg")
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


    useEffect(() => {
        if (!socketio || !chatId) return;
        setActiveItem('Messages');
        const handleTyping = (data) => {
            if (chatId === data.userId) {
                setTypingAnimation(true);
            }
        };
        const handleStopTyping = (data) => {
            if (chatId === data.userId) {
                setTypingAnimation(false);
            }
        };

        socketio.on('user_typing', handleTyping);
        socketio.on('user_stopped_typing', handleStopTyping);

        return () => {
            socketio.off('user_typing', handleTyping);
            socketio.off('user_stopped_typing', handleStopTyping);
        };
    }, [socketio, chatId]);

    useLayoutEffect(() => {
        if (!messagesEndRef.current) return;
        messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
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

    if (chatpageloading)
    {
        return (<div className="min-h-screen flex-1 my-3 flex flex-col justify-center items-center sm:pl-[94px]">
            <img src={NotextLogo} alt="Description" width="100" className="block my-8 pl-3"/>
        </div>)
    }

  return (
    <div onClick={()=>setSearchOpen(false)} className='flex ml-0 fixed md:top-0 top-[47px] md:mt-0 md:ml-[110px] h-[calc(100%-102px)] md:h-screen w-screen md:w-[calc(100%-94px)]'>
        <div className={`${selectedChat && chatId ? 'hidden sm:block' : ''} flex-none w-full sm:w-[380px] border-r border-white/10 bg-gradient-to-b from-white/5 to-transparent backdrop-blur-xl`}>
            <section className='px-4 w-full py-6'>
                <div className='flex items-center justify-between mb-6 px-2'>
                    <h1 className='font-bold text-xl tracking-tight'>{user?.username}</h1>
                    <div className='w-2 h-2 bg-green-400 rounded-full animate-pulse'></div>
                </div>
                <div className='overflow-y-auto h-[calc(100vh-120px)] custom-scrollbar pr-2'>
                    {
                        chatorder?.map((users) => {
                            const isonline = onlineUsers.includes(users.chatuser?._id);
                            const markRead = chatorder.map((chat) => {
                                if (chat.chatuser._id === users.chatuser?._id) {
                                    return {...chat, unreadCount: 0};
                                }
                                return chat;
                            });
                            return (
                                <div onClick={()=>{setShowEmoji(false);navigate(`/chat/${users.chatuser?._id}`);dispatch(setChatOrder(markRead))}} key={users.chatuser?._id} className={`${chatId == users.chatuser?._id ? 'bg-white/15 border border-white/10 shadow-lg' : 'hover:bg-white/8'} grid grid-cols-[56px_1fr_auto] gap-3 items-center my-1.5 cursor-pointer rounded-2xl p-3 transition-all duration-300`}>
                                    <div className='relative'>
                                        <Avatar className="relative flex shrink-0 overflow-hidden rounded-full h-14 w-14 ring-2 ring-white/10">
                                            <AvatarImage src={users.chatuser?.profilePic=='default.jpg' ? NotextLogo : users.chatuser?.profilePic} alt="postimg" className='size-full object-cover aspect-square' />
                                            <AvatarFallback>USER</AvatarFallback>
                                        </Avatar>
                                        <div className={`absolute bottom-0.5 right-0.5 rounded-full h-3 w-3 border-2 border-background ${isonline ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                                    </div>
                                    <div className='flex flex-col gap-0.5 min-w-0'>
                                        <h1 className={`font-semibold text-[15px] truncate ${users.unreadCount > 0 ? 'text-white' : ''}`}>{users.chatuser?._id == user?._id ? `${user?.username} (You)` : users.chatuser?.username}</h1>
                                        <span className={`text-sm truncate ${users.unreadCount > 0 ? 'text-white font-medium' : 'text-gray-400'}`}>
                                            {lastMsgs.filter((msg) => (msg?.receiver == users.chatuser?._id) || (msg?.sender == users.chatuser?._id))[0]?.message || 'Start a conversation'}
                                        </span>
                                    </div>
                                    {users.unreadCount > 0 && (
                                        <div className='flex items-center justify-center min-w-[22px] h-[22px] px-1.5 bg-blue-500 rounded-full'>
                                            <span className='text-xs font-bold text-white'>{users.unreadCount > 99 ? '99+' : users.unreadCount}</span>
                                        </div>
                                    )}
                                </div>
                            )
                        })
                    }
                </div>
            </section>
        </div>
        {(!selectedChat || !chatId ) && 
            <div className='hidden flex-1 sm:flex flex-col gap-4 min-w-0 justify-center items-center bg-gradient-to-br from-white/5 via-transparent to-white/5'> 
                <div className='p-8 rounded-full bg-white/5 backdrop-blur-sm border border-white/10'>
                    <svg aria-label="" fill="currentColor" height="80" role="img" viewBox="0 0 96 96" width="80" className='opacity-60'><title></title><path d="M48 0C21.532 0 0 21.533 0 48s21.532 48 48 48 48-21.532 48-48S74.468 0 48 0Zm0 94C22.636 94 2 73.364 2 48S22.636 2 48 2s46 20.636 46 46-20.636 46-46 46Zm12.227-53.284-7.257 5.507c-.49.37-1.166.375-1.661.005l-5.373-4.031a3.453 3.453 0 0 0-4.989.921l-6.756 10.718c-.653 1.027.615 2.189 1.582 1.453l7.257-5.507a1.382 1.382 0 0 1 1.661-.005l5.373 4.031a3.453 3.453 0 0 0 4.989-.92l6.756-10.719c.653-1.027-.615-2.189-1.582-1.453ZM48 25c-12.958 0-23 9.492-23 22.31 0 6.706 2.749 12.5 7.224 16.503.375.338.602.806.62 1.31l.125 4.091a1.845 1.845 0 0 0 2.582 1.629l4.563-2.013a1.844 1.844 0 0 1 1.227-.093c2.096.579 4.331.884 6.659.884 12.958 0 23-9.491 23-22.31S60.958 25 48 25Zm0 42.621c-2.114 0-4.175-.273-6.133-.813a3.834 3.834 0 0 0-2.56.192l-4.346 1.917-.118-3.867a3.833 3.833 0 0 0-1.286-2.727C29.33 58.54 27 53.209 27 47.31 27 35.73 36.028 27 48 27s21 8.73 21 20.31-9.028 20.31-21 20.31Z"></path></svg>
                    {/* Copied from Instagram */}
                </div>
                <p className='text-xl font-medium text-gray-300'>Your messages</p>
            </div>}
        {selectedChat && chatId && 
        <div className='flex-1 flex flex-col w-[calc(100vw-500px)] overflow-hidden bg-gradient-to-br from-transparent via-white/[0.02] to-transparent'>
            <Link to={`/profile/${selectedChat.username}`}>
                <div className='flex items-center m-4 p-3 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10'>
                    <div className='flex gap-3 items-center'>
                        <Avatar className="relative flex shrink-0 overflow-hidden rounded-full h-11 w-11 ring-2 ring-white/20">
                            <AvatarImage src={selectedChat.profilePic=='default.jpg' ? NotextLogo : selectedChat.profilePic} alt="postimg" className='size-full object-cover aspect-square' />
                            <AvatarFallback>USER</AvatarFallback>
                        </Avatar>
                        <div className='flex flex-col'>
                            <h1 className='font-semibold text-[15px]'>{selectedChat.username}</h1>
                            <span className='text-xs text-gray-400'>{onlineUsers.includes(selectedChat._id) ? 'Active now' : 'Offline'}</span>
                        </div>
                    </div>
                </div>
            </Link>
            <div ref={messagesEndRef} className='flex flex-col overflow-y-auto custom-scrollbar' style={{ flex: '1 1 auto', minHeight: '0px' }}>
                <div className='flex flex-col items-center mt-8 mb-6'>
                    <div className='p-1 rounded-full bg-gradient-to-br from-white/20 to-white/5'>
                        <Avatar className="relative flex shrink-0 overflow-hidden rounded-full h-24 w-24">
                            <AvatarImage src={selectedChat.profilePic=='default.jpg' ? NotextLogo : selectedChat.profilePic} alt="postimg" className='size-full object-cover aspect-square' />
                            <AvatarFallback>USER</AvatarFallback>
                        </Avatar>
                    </div>
                    <h1 className='font-semibold text-lg mt-3'>{selectedChat.username}</h1>
                    <Button onClick={()=>{navigate(`/profile/${selectedChat.username}`)}} className="mt-3 bg-white/10 backdrop-blur-sm border border-white/10 text-white text-sm font-medium hover:bg-white/20 hover:cursor-pointer transition-all duration-200 rounded-xl px-6">View Profile</Button>
                </div>
                {/* Chats map */}
                <div onClick={()=>{setShowEmoji(false)}} className='flex w-full flex-col gap-3 px-4' style={{ flex: '1 1 auto', minHeight: '0px' }}>
                    {conversations?.map((msg)=>{
                        return (
                            <div key={msg._id} className={`flex ${user._id === msg.sender?._id ? 'justify-end' : 'justify-start'}`}>
                                <div className={`py-2.5 px-4 text-left max-w-xs xl:max-w-md break-words text-white text-[15px] ${user._id === msg.sender?._id ? 'bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl rounded-br-md shadow-lg shadow-blue-500/20' : 'bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl rounded-bl-md'}`}>
                                    {msg?.message}
                                </div>
                            </div>
                        )
                    })}
                    {typinganimation && <div className={`flex justify-start`}>
                        <div className={`text-left max-w-xl break-words text-white bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl`}>
                            <TypingLoader className='p-2' />
                        </div>
                    </div>}
                </div>
            </div>
            <div onKeyDown={(e)=>{if(chattext.trim() != '' && e.key=='Enter' && !e.shiftKey){e.preventDefault();sendMsgHandler(selectedChat._id)}}} className='w-full px-4 pb-4 pt-2' style={{ flexShrink: 0 }}>
                <EmojiPicker open={showEmoji} onEmojiClick={(e)=>setChatText(prev=>prev+e.emoji)} className='!fixed !bottom-13 !z-10 mb-2' width={300} height={400} theme='dark' emojiStyle='apple' skinTonesDisabled={true} suggestedEmojisMode='recent' />
                <div className='border-white/15 w-full border rounded-2xl px-4 relative flex items-center bg-white/5 backdrop-blur-sm shadow-lg'>
                    <svg onClick={()=>setShowEmoji(prev=>!prev)} className='cursor-pointer transition-all duration-200 hover:scale-110 hover:opacity-80 mr-2' aria-label="Choose an emoji" fill="currentColor" height="24" role="img" viewBox="0 0 24 24" width="24"><title>Choose an emoji</title><path d="M15.83 10.997a1.167 1.167 0 1 0 1.167 1.167 1.167 1.167 0 0 0-1.167-1.167Zm-6.5 1.167a1.167 1.167 0 1 0-1.166 1.167 1.167 1.167 0 0 0 1.166-1.167Zm5.163 3.24a3.406 3.406 0 0 1-4.982.007 1 1 0 1 0-1.557 1.256 5.397 5.397 0 0 0 8.09 0 1 1 0 0 0-1.55-1.263ZM12 .503a11.5 11.5 0 1 0 11.5 11.5A11.513 11.513 0 0 0 12 .503Zm0 21a9.5 9.5 0 1 1 9.5-9.5 9.51 9.51 0 0 1-9.5 9.5Z"></path></svg>
                    <Textarea onFocus={handleFocus} onClick={()=>setShowEmoji(false)} value={chattext} onChange={(e)=>{setChatText(e.target.value);if(!istyping){socketio.emit('typing_started',(chatId));setIsTyping(true);}}} placeholder="Message..." className="flex-1 resize-none !text-[20px]  !border-0 !ring-0 !shadow-none focus:!ring-0 focus:!shadow-none focus:!border-0 focus-visible:!ring-0 focus-visible:!shadow-none focus-visible:!border-0 font-normal bg-transparent placeholder:text-gray-400" style={{ minHeight: '44px', maxHeight: '150px', height: 'auto', overflowY: 'auto', transition: 'height 0.1s ease-out', flexShrink: 0, display: 'block', position: 'relative' }} />
                    {chattext.trim() != '' && <span onClick={()=>sendMsgHandler(selectedChat._id)} className="text-blue-400 font-semibold cursor-pointer hover:text-blue-300 transition-all duration-150 active:scale-95 ml-2">Send</span>}
                </div>
            </div>
        </div>}
    </div>
  )
}

export default ChatPage