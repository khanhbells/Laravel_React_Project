import { PropsWithChildren, useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../redux/store"
import { useNavigate } from "react-router-dom";
import { fetchPatient } from "../service/Frontend/AuthPatientService";
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
                if (patientData) {
                    setPatientData(patientData)
                    dispatch(setAuthPatientLogin(patientData))
                } else {
                    setPatientData(undefined);
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