import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import { clearToast } from "../../redux/slide/toastSlice"
import { RootState } from "../../redux/store"
import { useSelector, useDispatch } from "react-redux"
import { showToast } from "../../helper/myHelper"
import Header from "./Header";
import Footer from "./Footer";
import '../../assets/scss/HomeHeader.scss'
import '../../assets/scss/HomePage.scss'

const LayoutFrontend: React.FC = () => {
    const { message, type } = useSelector((state: RootState) => state.toast)
    const dispatch = useDispatch()
    useEffect(() => {
        showToast(message, type)
        dispatch(clearToast())
    }, [message, type])
    return (
        <>
            <div className="page">
                <Header />
                <Outlet />
                <Footer />
            </div>
        </>
    )
}

export default LayoutFrontend