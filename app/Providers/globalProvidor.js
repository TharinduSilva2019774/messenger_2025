"use client";

import { createContext, useContext } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {

    return (
        <GlobalContext.Provider value={{}}>
            {children}
        </GlobalContext.Provider>
    )
}

export const useGlobalContext = () => useContext(GlobalContext);