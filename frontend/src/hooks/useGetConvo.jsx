import { useLoading } from "@/components/LoadingContext";
import { setSelectedChat } from "@/redux/authSlice";
import { setConversations } from "@/redux/chatSlice";
import  { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetConvo = (chatId) => {
    const dispatch = useDispatch();
    const {setconvoLoading} = useLoading();
    useEffect(()=>{
        console.log(chatId)
        const fetchConvo = async () => {
            setconvoLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/message/all/${chatId}`, {credentials:'include'});
                const data = await response.json();
                console.log(data);
                if (data.success) {
                    dispatch(setConversations(data.messages));
                    dispatch(setSelectedChat(data.receiver))
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error(error);
            }
            finally {
                setconvoLoading(false);
            }
        }
        if (chatId) fetchConvo();
    },[chatId])
};

export default useGetConvo;