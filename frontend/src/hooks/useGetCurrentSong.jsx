import { useLoading } from "@/components/LoadingContext";
import { setCurrentSong } from "@/redux/authSlice";
import  {useEffect } from "react";
import { useDispatch } from "react-redux";

const useGetCurrentSong = (userId, isConnected) => {
    const dispatch = useDispatch();
    const { setSpotifyLoading } = useLoading();

    if (!isConnected) {
        dispatch(setCurrentSong(null));
    }
    
    useEffect(()=>{
        const fetchCurrentSong = async () => {
            try {
                setSpotifyLoading(true);
                const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/current-song/${userId}`, {credentials:'include'});
                const data = await response.json();
                if (data.success) {
                    const { item } = data;
                    dispatch(setCurrentSong(item));
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setSpotifyLoading(false);
            }
        }
        let intervalId;

        if (isConnected) {
            fetchCurrentSong();
            intervalId = setInterval(fetchCurrentSong, 10000);
        } 
        else {
            dispatch(setCurrentSong(null));
            setSpotifyLoading(false);
        }

        return () => {
            clearInterval(intervalId); 
            setSpotifyLoading(false);
            dispatch(setCurrentSong(null));
        };

    },[userId, isConnected])
};

export default useGetCurrentSong;