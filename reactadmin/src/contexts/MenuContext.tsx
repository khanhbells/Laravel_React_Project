import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type TMenu = {
    [key: string]: any
}

interface MenuContextType {
    isDataMenus: TMenu;
    setDataMenus: React.Dispatch<React.SetStateAction<TMenu>>;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const useMenuContext = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error("useMenuContext phải được sử dụng bên trong MenuProvider");
    }
    return context;
};

export const MenuProvider: React.FC<{ children: ReactNode, dataMenus: TMenu }> = ({ children, dataMenus }) => {
    const [isDataMenus, setDataMenus] = useState<TMenu>(dataMenus);

    useEffect(() => {
        setDataMenus(dataMenus)
    }, [dataMenus])

    return (
        <MenuContext.Provider value={{ isDataMenus, setDataMenus }}>
            {children}
        </MenuContext.Provider>
    );
};
