import { setProfile } from "@/redux/authSlice";
import  {useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";


const useGetUser = (username) => {
    const dispatch = useDispatch();
    useEffect(()=>{
        const fetchProfile = async () => {
            try {
                const response = await fetch(`https://notinsta-gr7b.onrender.com/api/v1/user/${username}/profile`, {credentials:'include'});
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
        fetchProfile();
    },[username])
};

export default useGetUser;