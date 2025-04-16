import { setFeed } from "@/redux/postSlice";
import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";


const useGetFeed = () => {
    const dispatch = useDispatch();
    const {user} = useSelector(store=>store.auth)
    useEffect(()=>{
        const fetchFeed = async () => {
            try {
                const response = await fetch('https://testingnotinsta.onrender.com/api/v1/post/feed', {credentials:'include'});
                const data = await response.json();
                console.log(data, "yes");
                if (data.success) {
                    console.log(data.posts);
                    dispatch(setFeed(data.posts));
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error(error);
            }
        }
        if (user) fetchFeed();
    },[user,dispatch])
};

export default useGetFeed;