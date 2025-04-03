import React from "react";
import Feed from "./Feed";
import { Outlet } from "react-router-dom";
import SuggestionBar from "./SuggestionBar";

const Home = () => {
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