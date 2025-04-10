import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import SuggestionBar from "./SuggestionBar";
import useGetFeed from "@/hooks/useGetFeed";
import useGetSuggestions from "@/hooks/useGetSuggestions";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const Home = () => {
    useGetFeed();
    useGetSuggestions();
    const navigate = useNavigate();
    const { user } = useSelector(store=>store.auth);
    if (!user) navigate('/login')
    return (
        <div className="text-white flex">
            <div className="flex grow">
                <Feed />
                <Outlet />  
            </div>
            <SuggestionBar />
        </div>
    );
};

export default Home;