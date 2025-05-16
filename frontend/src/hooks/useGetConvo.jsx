import { setConversations } from "@/redux/chatSlice";
import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetConvo = () => {
    const dispatch = useDispatch();
    const {selectedChat} = useSelector(store=>store.auth)
    useEffect(()=>{
        const fetchConvo = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/message/all/${selectedChat?._id}`, {credentials:'include'});
                const data = await response.json();
                if (data.success) {
                    dispatch(setConversations(data.messages));
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error(error);
            }
        }
        if (selectedChat) fetchConvo();
    },[selectedChat])
};

export default useGetConvo;