import { useEffect } from "react"
import { useToast } from "../contexts/ToastContext"
import { showNotify } from "../helper/myHelper"

const Dashboard = () => {
    const { message, type, setMessage } = useToast()
    useEffect(() => {
        showNotify(message, type, setMessage)
    }, [message, type, setMessage])
    return (
        <>
            <div>
                Đây là trang Dashboard
            </div>
        </>
    )
}

export default Dashboard