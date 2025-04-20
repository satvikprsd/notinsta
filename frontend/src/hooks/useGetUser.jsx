import { setProfile } from "@/redux/authSlice";
import  {useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";


const useGetUser = (username, setLoading) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    useEffect(()=>{
        const fetchProfile = async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/${username}/profile`, {credentials:'include'});
                const data = await response.json();
                if (data.success) {
                    console.log(data.user,'data user');
                    console.log('data toh fetch hua')
                    dispatch(setProfile(data.user));
                    setLoading(false);
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error(error);
            }
        }
        fetchProfile();
    },[username, navigate])
};

export default useGetUser;