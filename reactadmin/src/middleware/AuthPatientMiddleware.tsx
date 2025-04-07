import { PropsWithChildren, useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../redux/store"
import { useNavigate } from "react-router-dom";
import { fetchPatient, logout } from "../service/Frontend/AuthPatientService";
import { setAuthPatientLogin, setAuthPatientLogout } from "../redux/slide/authPatientSlice";
import { PatientProvider } from "@/contexts/PatientContext";
import { Patient } from "@/types/Patient";
type ProtectedRouteProps = PropsWithChildren

const AuthPatienMiddleware = ({ children }: ProtectedRouteProps) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isAuthenticated, patient } = useSelector((state: RootState) => state.patient)
    const [patientDataContext, setPatientData] = useState<Patient | null | undefined>(null);

    useEffect(() => {
        const checkAuthenticate = async () => {
            if (!isAuthenticated || patient === null) {
                const patientData = await fetchPatient()
                if (patientData && patientData.publish !== 1) {
                    setPatientData(patientData)
                    dispatch(setAuthPatientLogin(patientData))
                } else if (patientData && patientData.publish === 1) {
                    const response = await logout();
                    if (response?.status === 200) {
                        setPatientData(undefined);
                        dispatch(setAuthPatientLogout());
                    }
                } else {                    
                    setPatientData(undefined);
                    dispatch(setAuthPatientLogout());
                }
            } 
        }
        checkAuthenticate()
    }, [isAuthenticated, patient, dispatch, navigate])
    
    return (
        <PatientProvider initialPatient={patientDataContext}>
            {children}
        </PatientProvider>
    )
}

export default AuthPatienMiddleware