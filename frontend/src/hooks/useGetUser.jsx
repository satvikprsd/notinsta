import { useLoading } from "@/components/LoadingContext";
import { setAuthUser, setProfile } from "@/redux/authSlice";
import  {useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const useGetUser = (username) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { setuserLoading } = useLoading();
    useEffect(()=>{
        const fetchProfile = async () => {
            try {
                setuserLoading(true);
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/${username}/profile`, {credentials:'include'});
                const data = await response.json();
                if (data.success) {
                    // console.log(data.user,'data user');
                    dispatch(setAuthUser(data.user));
                    
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error(error);
            }finally{
                setuserLoading(false);
            }
        }
        fetchProfile();
    },[username, navigate])
};

export default useGetUser;