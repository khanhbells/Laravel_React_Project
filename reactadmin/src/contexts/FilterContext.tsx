import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { SelectConfig } from "@/components/CustomFilter";


// CẤU HÌNH CONTEXT
interface FilterContext {
    filters: SelectConfig[],
    setFilters: React.Dispatch<React.SetStateAction<any>>
}
const FilterContext = createContext<FilterContext | undefined>(undefined)
export const useFilterContext = () => {
    const context = useContext(FilterContext)
    if (!context) {
        throw new Error('Có vấn đề xảy ra với useFilterContext')
    }

    return context
}




// KHỞI TẠO HOOK SAU KHI CẤU HÌNH CONTEXT
export const FilterProvider: React.FC<{ children: ReactNode, customFilters: SelectConfig[] }> = ({ children, customFilters }) => {

    const [filters, setFilters] = useState<SelectConfig[]>(customFilters)

    useEffect(() => {
        setFilters(customFilters)
    }, [customFilters])

    return (
        <FilterContext.Provider value={{ filters, setFilters }}>
            {children}
        </FilterContext.Provider>
    )
}