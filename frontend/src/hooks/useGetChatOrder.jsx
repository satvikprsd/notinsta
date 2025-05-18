import { setChatOrder } from "@/redux/chatSlice";
import  { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetChatOrder = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchorder = async () => {
            try{
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/getconvos`, {credentials:'include'});
                const data = await response.json();
                if (data.success){
                    dispatch(setChatOrder(data.convo));
                } else {
                    console.error(data.message);
                }
            }
            catch(e){
                console.log(e);
            }
        }
        fetchorder();
    },[])
};

export default useGetChatOrder;