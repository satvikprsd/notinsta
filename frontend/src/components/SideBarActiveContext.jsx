import { createContext, useContext, useState } from 'react';

const SidebarActiveContext = createContext();

export const SidebarActiveProvider = ({ children }) => {
    const [activeItem, setActiveItem] = useState('Home');

    return (
        <SidebarActiveContext.Provider value={{ activeItem, setActiveItem }}>
            {children}
        </SidebarActiveContext.Provider>
    );
};

export const useActiveSideBar = () => useContext(SidebarActiveContext);

