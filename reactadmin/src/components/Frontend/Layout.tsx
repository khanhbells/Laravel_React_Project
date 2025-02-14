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
import { useQuery } from "react-query";
import { menus, systems } from "@/service/Frontend/FrontEndService";
import { endpoint } from "@/constant/endpoint";
import { SystemProvider } from "@/contexts/SystemContext";
import { MenuProvider } from "@/contexts/MenuContext";

const LayoutFrontend: React.FC = () => {
    const { message, type } = useSelector((state: RootState) => state.toast)
    const dispatch = useDispatch()
    useEffect(() => {
        showToast(message, type)
        dispatch(clearToast())
    }, [message, type])
    const { data: dataSystems, isLoading: isLoadingSystem } = useQuery(['systems'],
        () => systems('', endpoint.systems)
    )
    const { data: dataMenu, isLoading: isLoadingMenu } = useQuery(['menus'],
        () => menus('', endpoint.menus)
    )
    return (
        <>
            <div className="page">
                <MenuProvider dataMenus={dataMenu?.menus || undefined}>
                    <SystemProvider dataSystems={dataSystems?.systems || undefined}>
                        <Header />
                        <Outlet />
                        <Footer />
                    </SystemProvider>
                </MenuProvider>
            </div>
        </>
    )
}

export default LayoutFrontend