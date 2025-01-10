import { PropsWithChildren, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../redux/store"
import { useNavigate } from "react-router-dom"
import { fetchUser } from "../service/AuthService";

type ProtectedRouteProps = PropsWithChildren

const NoAuthMiddleware = ({ children }: ProtectedRouteProps) => {

    const navigate = useNavigate()
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth)
    const [checkedAuth, setCheckedAuth] = useState<boolean>(false)
    const checkAuthenticate = async () => {
        try {
            const userData = await fetchUser();
            if (userData !== null) {
                console.log(456);
                navigate('/dashboard');
            } else {
                setCheckedAuth(true);
            }
        } catch (error) {
            setCheckedAuth(true);
        }
    };
    useEffect(() => {
        if (!isAuthenticated || user === null) {
            // console.log(789);
            // checkAuthenticate();
            setCheckedAuth(true);
        } else {
            checkAuthenticate();
        }
    }, [checkedAuth, isAuthenticated, user]);

    return checkedAuth ? children : null
}

export default NoAuthMiddleware