import { useLoading } from "@/components/LoadingContext";
import { setLastMsgs } from "@/redux/chatSlice";
import  { useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetLastMsgs = () => {
    const dispatch = useDispatch();
    const {setLastMsgLoading} = useLoading();
    useEffect(()=>{
        const fetchLastMsg = async () => {
            setLastMsgLoading(true);
            try{
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/message/alllastmsg`, {credentials:'include'});
                const data = await response.json();
                console.log(data, "lastmessages")
                if (data.success){
                    dispatch(setLastMsgs(data.chats));
                } else {
                    console.error(data.message);
                }
            }
            catch(e){
                console.log(e);
            }
            finally{
                setLastMsgLoading(false);
            }
        }
        fetchLastMsg();
    },[])
};

export default useGetLastMsgs;