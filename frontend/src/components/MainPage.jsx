import React from "react";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import { SearchProvider } from "./SearchContext";

const MainPage = () => {
    return (
        <SearchProvider>
            <div className="w-screen h-screen fade-in">
                <SideBar />
                <>
                    <Outlet />
                </>
            </div>
        </SearchProvider>
    );
};

export default MainPage;