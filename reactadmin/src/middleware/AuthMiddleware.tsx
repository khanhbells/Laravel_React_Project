import { PropsWithChildren } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import { useNavigate } from "react-router-dom";

type ProtectedRouteProps = PropsWithChildren

const AuthMiddleware = ({ children }: ProtectedRouteProps) => {

    const navigate = useNavigate()
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

    if (isAuthenticated === false || user === null) {
        navigate('/admin') //Dang lam o day
    } else {
        return children
    }


}

export default AuthMiddleware