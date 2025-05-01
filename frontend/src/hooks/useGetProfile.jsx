import { useLoading } from "@/components/LoadingContext";
import { setProfile } from "@/redux/authSlice";
import  {useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useLocation } from 'react-router-dom';

const useGetProfile = (username) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { setprofileLoading } = useLoading();
    useEffect(()=>{
        const fetchProfile = async () => {
            try {
                setprofileLoading(true);
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/${username}/profile`, {credentials:'include'});
                const data = await response.json();
                if (data.success) {
                    // console.log(data.user,'data user');
                    dispatch(setProfile(data.user));
                    
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                console.error(error);
            }finally{
                setprofileLoading(false);
            }
        }
        fetchProfile();
    },[username, location, navigate])
};

export default useGetProfile;