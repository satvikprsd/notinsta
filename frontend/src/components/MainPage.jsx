import React from "react";
import SideBar from "./SideBar";
import { Outlet } from "react-router-dom";
import { useChat } from "./ChatContext";

const MainPage = () => {
    const {ChatPageRef} = useChat();
    return (
            <div ref={ChatPageRef} className="w-screen h-screen fade-in">
                <SideBar />
                <>
                    <Outlet />
                </>
            </div>
    );
};

export default MainPage;