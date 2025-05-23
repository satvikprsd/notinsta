import { setSavedPosts } from "@/redux/authSlice";
import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const useGetSavedPosts = () => {
    const dispatch = useDispatch();
    const {user} = useSelector(store=>store.auth)
    useEffect(()=>{
        const fetchSavedPosts = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/savedposts`, {credentials:'include'});
                const data = await response.json();
                if (data.success) {
                    // console.log(data.savedPosts, "saved posts 123");
                    dispatch(setSavedPosts(data.savedPosts));
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error(error);
            }
        }
        if (user) fetchSavedPosts();
    },[])
};

export default useGetSavedPosts;