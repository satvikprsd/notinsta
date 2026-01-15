import { useLoading } from "@/components/LoadingContext";
import { setChatOrder, setLastMsgs } from "@/redux/chatSlice";
import  { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetChatOrder = () => {
    const dispatch = useDispatch();
    const {setchatpageLoading} = useLoading();
    useEffect(()=>{
        const fetchorder = async () => {
            setchatpageLoading(true);
            try{
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/getconvos`, {credentials:'include'});
                const data = await response.json();
                console.log(data)
                if (data.success){
                    dispatch(setChatOrder(data.convo));
                    dispatch(setLastMsgs(data.convo.map(convo => convo.lastMessage)));
                } else {
                    console.error(data.message);
                }
            }
            catch(e){
                console.log(e);
            }
            finally{
                setchatpageLoading(false);
            }
        }
        fetchorder();
    },[])
};

export default useGetChatOrder;