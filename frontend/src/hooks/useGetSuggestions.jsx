import { setSuggestedUsers } from "@/redux/authSlice";
import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";


const useGetSuggestions = () => {
    const dispatch = useDispatch();
    const {user} = useSelector(store=>store.auth)
    useEffect(()=>{
        const fetchAllSuggestions = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/suggestions`, {credentials:'include'});
                const data = await response.json();
                if (data.success) {
                    // console.log(data.suggestions);
                    dispatch(setSuggestedUsers(data.suggestions));
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error(error);
            }
        }
        if (user) fetchAllSuggestions();
    },[])
};

export default useGetSuggestions;