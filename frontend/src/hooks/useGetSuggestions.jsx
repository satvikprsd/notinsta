import { useLoading } from "@/components/LoadingContext";
import { setSuggestedUsers } from "@/redux/authSlice";
import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetSuggestions = () => {
    const dispatch = useDispatch();
    const {user} = useSelector(store=>store.auth)
    const { setsuggestionLoading } = useLoading();
    useEffect(()=>{
        const fetchAllSuggestions = async () => {
            setsuggestionLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/suggestions`, {credentials:'include'});
                const data = await response.json();
                if (data.success) {
                    // console.log(data.suggestions);
                    dispatch(setSuggestedUsers(data.suggestions));
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error(error);
            }
            finally {
                setsuggestionLoading(false);
            }
        }
        if (user) fetchAllSuggestions();
    },[])
};

export default useGetSuggestions;