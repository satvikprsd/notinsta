import { setPosts } from "@/redux/postSlice";
import  { useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetPosts = () => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchAllPosts = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/v1/post/feed', {credentials:'include'});
                const data = await response.json();
                if (data.success) {
                    console.log(data.posts);
                    dispatch(setPosts(data.posts));
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchAllPosts();
    },[])
};

export default useGetPosts;