import { setSuggestedUsers } from "@/redux/authSlice";
import  { useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetSuggestions = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchAllSuggestions = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/user/suggestions', {credentials:'include'});
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