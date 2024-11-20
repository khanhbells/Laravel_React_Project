import { useEffect } from "react"
// import { useToast } from "../contexts/ToastContext"
// import { showNotify } from "../helper/myHelper"
import { clearToast } from "../redux/slide/toastSlice"
import { RootState } from "../redux/store"
import { useSelector, useDispatch } from "react-redux"
import { showToast } from "../helper/myHelper"


const Dashboard = () => {
    // const { message, type, setMessage } = useToast()

    const { message, type } = useSelector((state: RootState) => state.toast)
    const dispatch = useDispatch()
    useEffect(() => {
        showToast(message, type)
        dispatch(clearToast())
    }, [message, type])
    return (
        <>
            <div>
                Đây là trang Dashboard
            </div>
        </>
    )
}

export default Dashboard