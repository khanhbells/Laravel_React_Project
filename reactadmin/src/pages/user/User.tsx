import { Link } from "react-router-dom"
const User = () => {
    return (
        <>
            <div>
                Đây là trang User
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/admin">Admin</Link>
            </div>
        </>
    )
}

export default User