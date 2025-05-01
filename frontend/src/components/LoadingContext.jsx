import React, { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [feedloading, setfeedLoading] = useState(true);
    const [suggestionloading, setsuggestionLoading] = useState(true);
    const [userloading, setuserLoading] = useState(true);
    const [profileloading, setprofileLoading] = useState(true);

    return (
        <LoadingContext.Provider value={{ feedloading, setfeedLoading, suggestionloading, setsuggestionLoading, userloading, setuserLoading, profileloading, setprofileLoading  }}>
            {children}
        </LoadingContext.Provider>
    );
};

export const useLoading = () => useContext(LoadingContext);
