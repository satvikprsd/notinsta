import React, { createContext, useContext, useState } from "react";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const [socketio, setSocketIO] = useState(null);

    return (
        <SocketContext.Provider value={{ socketio, setSocketIO }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
