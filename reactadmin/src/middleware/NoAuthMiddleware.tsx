import { PropsWithChildren, useEffect, useState } from "react"
import { RootState } from '../redux/store'
import { useSelector } from "react-redux"
import { useNavigate } from 'react-router-dom'
import { fetchUser } from "@/service/AuthService";


type ProtectedRouteProps = PropsWithChildren

const NoAuthMiddleware = ({ children }: ProtectedRouteProps) => {

    const navigate = useNavigate()
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
    const [checkedAuth, setCheckedAuth] = useState<boolean>(false)


    useEffect(() => {
        const checkAuthenticate = async () => {
            try {
                const userData = await fetchUser()

                if (userData !== null) {
                    navigate('/dashboard')
                } else {
                    setCheckedAuth(true)
                }
            } catch (error) {
                setCheckedAuth(true)
            }
        }
        if (!isAuthenticated || user === null) {
            checkAuthenticate()
        } else {
            navigate('/dashboard')
        }

    }, [isAuthenticated, user, navigate])

    return checkedAuth ? children : null
}

export default NoAuthMiddleware