import { useLoading } from "@/components/LoadingContext";
import { useSocket } from "@/components/SocketContext";
import { setChatOrder, setConversations } from "@/redux/chatSlice";
import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetSocketConvo = () => {
    const dispatch = useDispatch();
    const {chatorder} = useSelector(store=>store.chats)
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
        })

        return () => socketio?.off('newChat');
    },[conversations, setConversations])
};

export default useGetSocketConvo;