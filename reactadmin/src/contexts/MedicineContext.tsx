import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Medicine } from "@/interfaces/types/MedicineType";
interface MedicineContextType {
    activeIndices: Medicine[];
    setActiveIndices: React.Dispatch<React.SetStateAction<Medicine[]>>;
}

const MedicineContext = createContext<MedicineContextType | undefined>(undefined);

export const useMedicineContext = () => {
    const context = useContext(MedicineContext);
    if (!context) {
        throw new Error("useMedicineContext phải được sử dụng bên trong MedicineProvider");
    }
    return context;
};

export const MedicineProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeIndices, setActiveIndices] = useState<Medicine[]>([]);


    return (
        <MedicineContext.Provider value={{ activeIndices, setActiveIndices }}>
            {children}
        </MedicineContext.Provider>
    );
};
