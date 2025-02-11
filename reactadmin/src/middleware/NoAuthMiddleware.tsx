import { useEffect, useState } from "react";
import { RootState } from "../redux/store";
import { useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";
import { fetchUser } from "@/service/AuthService";

const NoAuthMiddleware = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
    const [checkedAuth, setCheckedAuth] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const checkAuthenticate = async () => {
            try {
                const userData = await fetchUser();
                if (userData) {
                    navigate("/dashboard"); // Nếu đã đăng nhập, chuyển hướng đến dashboard
                } else {
                    setCheckedAuth(true); // Cho phép hiển thị route con
                }
            } catch (error) {
                setCheckedAuth(true);
            } finally {
                setLoading(false);
            }
        };

        if (!isAuthenticated || !user) {
            checkAuthenticate();
        } else {
            navigate("/dashboard");
        }
    }, [isAuthenticated, user, navigate]);

    if (loading) return <div>Đang kiểm tra đăng nhập...</div>;

    return checkedAuth ? <Outlet /> : null;
};

export default NoAuthMiddleware;
