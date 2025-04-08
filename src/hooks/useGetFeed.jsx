import { setFeed } from "@/redux/postSlice";
import  { useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetFeed = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchFeed = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/post/feed', {credentials:'include'});
                const data = await response.json();
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
        fetchFeed();
    },[])
};

export default useGetFeed;