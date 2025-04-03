import React from "react";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";

const MainPage = () => {
    return (
        <div className="w-screen h-screen fade-in">
            <SideBar />
            <>
                <Outlet />
            </>
        </div>
    );
};

export default MainPage;