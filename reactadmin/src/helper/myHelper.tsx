import { toast } from "react-toastify"
import { ToastType } from "../contexts/ToastContext"

export const showNotify = (
    message: string,
    type: ToastType,
    setMessage: (message: string, type?: ToastType) => void
) => {
    if (message) {
        switch (type) {
            case 'success':
                toast.success(message)
                break;
            case 'warning':
                toast.warning(message)
                break;
            case 'error':
                toast.error(message)
                break;
            default:
                break;
        }
        setMessage('', null)
    }
}

export const showToast = (
    message: string,
    type: ToastType,
) => {
    if (message) {
        switch (type) {
            case 'success':
                toast.success(message)
                break;
            case 'warning':
                toast.warning(message)
                break;
            case 'error':
                toast.error(message)
                break;
            default:
                break;
        }
    }


}

export function getInitialName(string: string) {
    //split tach chuoi thanh mang
    const words = string.trim().split(/\s+/)

    const initial = words.map(word => word.charAt(0).toUpperCase()).join('')
    return initial
}

