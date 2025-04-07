import React, { createContext, useState, useContext, ReactNode, useEffect } from "react";

// CẤU HÌNH CONTEXT
interface Patient {
    id: string;
    name: string;
    email: string;
    [key: string]: any; // Nếu cần thêm các thuộc tính khác
}

interface PatientContext {
    patient: Patient | null | undefined;
    setPatient: React.Dispatch<React.SetStateAction<Patient | null | undefined>>;
}

const PatientContext = createContext<PatientContext | undefined>(undefined);

// HOOK SỬ DỤNG CONTEXT
export const usePatientContext = () => {
    const context = useContext(PatientContext);
    if (!context) {
        throw new Error("Có vấn đề xảy ra với usePatientContext");
    }
    return context;
};

// KHỞI TẠO PROVIDER
export const PatientProvider: React.FC<{ children: ReactNode; initialPatient: Patient | null | undefined }> = ({ children, initialPatient }) => {
    const [patient, setPatient] = useState<Patient | null | undefined>(initialPatient);

    useEffect(() => {
        setPatient(initialPatient); // Cập nhật patient khi initialPatient thay đổi
    }, [initialPatient]);

    return (
        <PatientContext.Provider value={{ patient, setPatient }}>
            {children}
        </PatientContext.Provider>
    );
};