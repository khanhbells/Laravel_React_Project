import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { clearToast } from "../redux/slide/toastSlice"
import { RootState } from "../redux/store"
import { useSelector, useDispatch } from "react-redux"
import { showToast } from "../helper/myHelper"
import { fetchUser } from "../service/AuthService";

const Layout: React.FC = () => {

    const { message, type } = useSelector((state: RootState) => state.toast)
    const dispatch = useDispatch()
    useEffect(() => {
        showToast(message, type)
        dispatch(clearToast())
    }, [message, type])

    useEffect(() => {
        fetchUser()
    }, [])

    return (
        <>
            Đây là trang Layout tổng

            <Outlet />
        </>
    )
}

export default Layout