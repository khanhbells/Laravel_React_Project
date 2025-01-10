import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

// CẤU HÌNH CONTEXT
interface User {
    id: number;
    name: string;
    email: string;
    [key: string]: any; // Nếu cần thêm các thuộc tính khác
}

interface UserContext {
    user: User | null;
    setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

const UserContext = createContext<UserContext | undefined>(undefined);

// HOOK SỬ DỤNG CONTEXT
export const useUserContext = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("Có vấn đề xảy ra với useUserContext");
    }
    return context;
};

// KHỞI TẠO PROVIDER
export const UserProvider: React.FC<{ children: ReactNode; initialUser: User | null }> = ({ children, initialUser }) => {
    const [user, setUser] = useState<User | null>(initialUser);

    useEffect(() => {
        setUser(initialUser);
    }, [initialUser]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};