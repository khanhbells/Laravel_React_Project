import React, { createContext, useContext, useState } from 'react';

interface DataScheduleContextType {
    selectedDataSchedule: any;
    setSelectedDataSchedule: (timeSlot: any) => void;
}

const DataScheduleContext = createContext<DataScheduleContextType | undefined>(undefined);

export const DataScheduleProvider = ({ children }: { children: React.ReactNode }) => {
    const [selectedDataSchedule, setSelectedDataSchedule] = useState<any>(null);

    return (
        <DataScheduleContext.Provider value={{ selectedDataSchedule, setSelectedDataSchedule }}>
            {children}
        </DataScheduleContext.Provider>
    );
};

export const useDataSchedule = () => {
    const context = useContext(DataScheduleContext);
    if (!context) {
        throw new Error('useDataSchedule must be used within a DataScheduleProvider');
    }
    return context;
};
