import { useLoading } from "@/components/LoadingContext";
import { useSocket } from "@/components/SocketContext";
import { setChatOrder, setConversations, setLastMsgs } from "@/redux/chatSlice";
import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetSocketConvo = () => {
    const dispatch = useDispatch();
    const {chatorder, lastMsgs} = useSelector(store=>store.chats)
    const {selectedChat} = useSelector(store=>store.auth);
    const { socketio } = useSocket();
    const { conversations } = useSelector(store=>store.chats)
    const { setTypingAnimation} = useLoading();
    useEffect(()=>{
        socketio?.on('newChat', (newmsg)=>{
            if (newmsg.sender._id == selectedChat._id){
                setTypingAnimation(false);
                dispatch(setConversations([...conversations, newmsg]))
            }
            const filteredOrder = chatorder.filter(chat => chat.chatuser._id !== newmsg.sender._id);
            dispatch(setChatOrder([{chatuser: newmsg.sender, updatedAt: new Date().toISOString()}, ...filteredOrder]))
            const updatedLastMsgs = lastMsgs.filter(msg => msg?.sender !== newmsg.sender._id && msg?.receiver !== newmsg.sender._id);
            dispatch(setLastMsgs([...updatedLastMsgs, {...newmsg, receiver: newmsg.receiver._id, sender: newmsg.sender._id}]))
        })

        return () => socketio?.off('newChat');
    },[conversations, setConversations])
};

export default useGetSocketConvo;