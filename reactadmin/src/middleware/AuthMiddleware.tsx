import { PropsWithChildren, useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import { useNavigate } from "react-router-dom";

type ProtectedRouteProps = PropsWithChildren

const AuthMiddleware = ({ children }: ProtectedRouteProps) => {

    // const navigate = useNavigate()
    // const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

    // useEffect(() => {
    //     if (!isAuthenticated || user === null) {
    //         navigate('admin')
    //     }
    // }, [isAuthenticated, user])

    // return isAuthenticated && user ? children : null
    return children
}

export default AuthMiddleware