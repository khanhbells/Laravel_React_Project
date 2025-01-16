import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { TimeSlot } from "@/interfaces/types/TimeSlotType";
interface TimeSlotContextType {
    activeIndices: TimeSlot[];
    setActiveIndices: React.Dispatch<React.SetStateAction<TimeSlot[]>>;
}

const TimeSlotContext = createContext<TimeSlotContextType | undefined>(undefined);

export const useTimeSlotContext = () => {
    const context = useContext(TimeSlotContext);
    if (!context) {
        throw new Error("useTimeSlotContext phải được sử dụng bên trong TimeSlotProvider");
    }
    return context;
};

export const TimeSlotProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [activeIndices, setActiveIndices] = useState<TimeSlot[]>([]);


    return (
        <TimeSlotContext.Provider value={{ activeIndices, setActiveIndices }}>
            {children}
        </TimeSlotContext.Provider>
    );
};

[
    {
        id: "1",
        start_time: "11:00 AM",
        end_time: "12:00 AM",
        publish: "2"
    },
    {
        id: "2",
        start_time: "10:00 AM",
        end_time: "10:30 AM",
        publish: "2"
    }
]
