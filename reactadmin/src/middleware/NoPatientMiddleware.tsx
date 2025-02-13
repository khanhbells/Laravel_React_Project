import { PropsWithChildren, useEffect, useState } from "react"
import { RootState } from '../redux/store'
import { useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom'
import { fetchPatient } from "@/service/Frontend/AuthPatientService";
import { PatientProvider } from "@/contexts/PatientContext";
import { Patient } from "@/types/Patient";

type ProtectedRouteProps = PropsWithChildren

const NoAuthMiddleware = ({ children }: ProtectedRouteProps) => {

    const navigate = useNavigate()
    const { isAuthenticated, patient } = useSelector((state: RootState) => state.patient)
    const [checkedAuth, setCheckedAuth] = useState<boolean>(false)
    const [patientDataContext, setPatientData] = useState<Patient | null | undefined>(null);

    useEffect(() => {
        const checkAuthenticate = async () => {
            try {
                const patientData = await fetchPatient()

                if (patientData !== null) {
                    console.log(123);

                    setPatientData(patientData)
                    navigate(`${import.meta.env.VITE_HOMEPAGE_URL}`)
                } else {
                    setPatientData(undefined);
                    setCheckedAuth(true)
                }
            } catch (error) {
                setCheckedAuth(true)
            }
        }
        if (!isAuthenticated || patient === null) {
            checkAuthenticate()
        } else {
            navigate(`${import.meta.env.VITE_HOMEPAGE_URL}`)
        }

    }, [isAuthenticated, patient, navigate])
    return (
        <PatientProvider initialPatient={patientDataContext}>
            {checkedAuth ? children : null}
        </PatientProvider>
    )
}

export default NoAuthMiddleware