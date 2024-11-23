import { PropsWithChildren, useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../service/AuthService";
import { setAuthLogin, setAuthLogout } from "../redux/slide/authSlice";
import { useDispatch } from "react-redux"

type ProtectedRouteProps = PropsWithChildren

const AuthMiddleware = ({ children }: ProtectedRouteProps) => {
    console.log(children);

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)

    useEffect(() => {
        const checkAuthenticate = async () => {
            if (!isAuthenticated || user === null) {
                const userData = await fetchUser()
                if (userData) {
                    dispatch(setAuthLogin(userData))
                } else {
                    dispatch(setAuthLogout())
                    navigate('/admin')
                }
            }
        }
        checkAuthenticate()
    }, [isAuthenticated, user, dispatch, navigate])
    return isAuthenticated && user ? children : null
}

export default AuthMiddleware