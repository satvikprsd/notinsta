import { useLoading } from "@/components/LoadingContext";
import { setAuthUser } from "@/redux/authSlice";
import { setFeed } from "@/redux/postSlice";
import  { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const logout = async (dispatch,navigate) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/logout`);
        // console.log(response)
        const data = await response.json();
        if (data.success) {
            dispatch(setAuthUser(null));
            toast.success(data.message);
            navigate("/login");
        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.message);
    }
}


const useGetFeed = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user} = useSelector(store=>store.auth)
    const { setLoading } = useLoading();
    useEffect(()=>{
        const fetchFeed = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/post/feed`, {credentials:'include'});
                const data = await response.json();
                if (data.success) {
                    // console.log(data.posts);
                    dispatch(setFeed(data.posts));
                } else {
                    logout(dispatch,navigate);
                    toast.error(data.message);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }
        if (user) fetchFeed();
    },[])
};

export default useGetFeed;