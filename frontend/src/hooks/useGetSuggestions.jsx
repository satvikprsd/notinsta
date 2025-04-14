import { setSuggestedUsers } from "@/redux/authSlice";
import  { useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";


const useGetSuggestions = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchAllSuggestions = async () => {
            try {
                const response = await fetch('https://notinsta-gr7b.onrender.com/api/v1/user/suggestions', {credentials:'include'});
                const data = await response.json();
                if (data.success) {
                    console.log(data.suggestions);
                    dispatch(setSuggestedUsers(data.suggestions));
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchAllSuggestions();
    },[])
};

export default useGetSuggestions;