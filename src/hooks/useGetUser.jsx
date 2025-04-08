import { setProfile } from "@/redux/authSlice";
import  { use, useEffect } from "react";
import { useDispatch } from "react-redux";


const useGetUser = (username) => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchAllPosts = async () => {
            try {
                const response = await fetch(`http://localhost:8000/api/v1/user/${username}/profile`, {credentials:'include'});
                const data = await response.json();
                if (data.success) {
                    console.log(data.user);
                    dispatch(setProfile(data.user));
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchAllPosts();
    },[username])
};

export default useGetUser;