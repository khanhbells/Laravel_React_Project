import { PropsWithChildren, useEffect, useState } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "../redux/store"
import { useNavigate } from "react-router-dom";
import { fetchUser } from "../service/AuthService";
import { setAuthLogin, setAuthLogout } from "../redux/slide/authSlice";
import { UserProvider } from "@/contexts/UserContext";
import { User } from "@/types/User";
type ProtectedRouteProps = PropsWithChildren

const AuthMiddleware = ({ children }: ProtectedRouteProps) => {

    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
    const [userData, setUserData] = useState<User | null>(null);
    useEffect(() => {
        const checkAuthenticate = async () => {
            if (!isAuthenticated || user === null) {
                const userData = await fetchUser()
                console.log(userData);
                if (userData) {
                    setUserData(userData)
                    dispatch(setAuthLogin(userData))
                } else {
                    dispatch(setAuthLogout())
                    navigate('/admin')
                }
            } else {
                setUserData(user);
            }
        }
        checkAuthenticate()
    }, [isAuthenticated, user, dispatch, navigate])
    return (
        <UserProvider initialUser={userData}>
            {isAuthenticated && user ? children : null}
        </UserProvider>
    )
}

export default AuthMiddleware