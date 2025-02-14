import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type TSystem = {
    homepage_copyright: string
    [key: string]: any
}

interface SystemContextType {
    isDataSystems: TSystem;
    setDataSystems: React.Dispatch<React.SetStateAction<TSystem>>;
}

const SystemContext = createContext<SystemContextType | undefined>(undefined);

export const useSystemContext = () => {
    const context = useContext(SystemContext);
    if (!context) {
        throw new Error("useSystemContext phải được sử dụng bên trong SystemProvider");
    }
    return context;
};

export const SystemProvider: React.FC<{ children: ReactNode, dataSystems: TSystem }> = ({ children, dataSystems }) => {
    const [isDataSystems, setDataSystems] = useState<TSystem>(dataSystems);

    useEffect(() => {
        setDataSystems(dataSystems)
    }, [dataSystems])

    return (
        <SystemContext.Provider value={{ isDataSystems, setDataSystems }}>
            {children}
        </SystemContext.Provider>
    );
};
