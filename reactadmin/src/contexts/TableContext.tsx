import React, { createContext, useContext, ReactNode } from "react";
import useTable from "@/hook/useTable";

interface TableContextProps {
    isLoading: boolean;
    data: any;
    isError: boolean;
    refetch: () => void;
    handlePageChange: (page: number) => void;
    handleQueryString: (query: any) => void;
}

const TableContext = createContext<TableContextProps | undefined>(undefined);

interface TableProviderProps {
    children: ReactNode;
    model: string;
    pagination: any;
}

export const TableProvider = ({ children, model, pagination }: TableProviderProps) => {
    const { isLoading, data, isError, refetch, handlePageChange, handleQueryString } = useTable({
        model,
        pagination,
    });

    return (
        <TableContext.Provider
            value={{
                isLoading,
                data,
                isError,
                refetch,
                handlePageChange,
                handleQueryString,
            }}
        >
            {children}
        </TableContext.Provider>
    );
};

export const useTableContext = () => {
    const context = useContext(TableContext);
    if (!context) {
        throw new Error("useTableContext must be used within a TableProvider");
    }
    return context;
};
