import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { canonical } from "@/constant/canonical";
import { useMenuContext } from "@/contexts/MenuContext";
import { usePatientContext } from "@/contexts/PatientContext";
import { useSystemContext } from "@/contexts/SystemContext";
import { writeUrl } from "@/helper/myHelper";
import { setAuthPatientLogout } from "@/redux/slide/authPatientSlice";
import { openSheet } from "@/redux/slide/sheetSlice";
import { RootState } from "@/redux/store";
import { fetchPatient, logout } from "@/service/Frontend/AuthPatientService";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { CgProfile } from "react-icons/cg";
import { FaHistory } from "react-icons/fa";
import { IoExitOutline } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { LoadingSpinner } from "../ui/loading";
import CustomSheet from "../CustomSheet";
import useSheet from "@/hook/useSheet";
import UpdatePatient from "./Section/UpdatePatient";
const Header = () => {
    //-------------REDUX-CONTEXT-----------------------
    const dispatch = useDispatch();
    const { isAuthenticated, patient: patientRedux } = useSelector(
        (state: RootState) => state.patient
    );
    const { patient: patientContext, setPatient } = usePatientContext();
    const { isDataSystems } = useSystemContext();
    const { isDataMenus } = useMenuContext();
    const { isSheetOpen, openSheet ,closeSheet } = useSheet();


    const handleLogout = async () => {
        try {
            const response = await logout();
            if (response?.status === 200) {
                setPatient(undefined);
                dispatch(setAuthPatientLogout());
            }
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };
    //---------------QUERY---------------------
    const menuData = useMemo(() => {
        if (isDataMenus) {
            return [
                {
                    title: "Dịch vụ khám",
                    subItems: isDataMenus.specialty_catalogues,
                    model: "specialty",
                },
                {
                    title: "Cơ sở y tế",
                    subItems: isDataMenus.hospitals,
                    model: "hospital",
                },
                {
                    title: "Bài viết",
                    subItems: isDataMenus.post_catalogues,
                    model: "post",
                },
                {
                    title: "Giới thiệu",
                },
                {
                    title: "Liên hệ",
                },
            ];
        }
        return [];
    }, [isDataMenus]);

    const [openIndex, setOpenIndex] = useState(null); // Lưu ID của menu đang mở

    const handleMouseEnter = (index: any) => {
        setOpenIndex(index);
    };

    const handleMouseLeave = () => {
        setOpenIndex(null);
    };
    
    const handleOpenSheet = async () => {
        const response  = await fetchPatient();
        if (response && response.publish !== 1) {
            openSheet({ open: true, action: 'update', id: patientRedux?.id })
        } else if (response && response.publish === 1 || !response) {
            setPatient(undefined);
            dispatch(setAuthPatientLogout());
        }
    }

    useEffect(() => {
        console.log(patientRedux, patientContext);
        
    }, [patientContext, patientRedux]);


    return (
        <>
            <header className="bg-sky-50 z-999">
                <div className="grid grid-cols-12 h-[100%]">
                    <div className="col-span-3 flex items-center">
                        <Link to={`${import.meta.env.VITE_HOMEPAGE_URL}`}>
                            {isDataSystems ? (
                                <img
                                    src={isDataSystems.homepage_logon}
                                    className="w-[70%] h-[70%] bg-contain cursor-pointer transform scale-50"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full">
                                    <LoadingSpinner className="mr-[5px]" />
                                    Loading...
                                </div>
                            )}
                        </Link>
                        {/* <div className='w-[100%] h-[100%] bg-contain cursor-pointer transform scale-50'></div> */}
                    </div>
                    <div className="col-span-7 flex justify-between items-center">
                        <ul className="relative w-full justify-between md:flex md:items-center">
                            {menuData.map((item, index) => (
                                <li
                                    key={index}
                                    className="relative"
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <a href="#">
                                        <span className="flex items-center gap-2 text-base font-medium hover:text-sky-400">
                                            <p className="text-primary mb-0 font-montserrat font-semibold hover:text-sky-400">
                                                {item.title}
                                            </p>
                                            {item.subItems && (
                                                <motion.span
                                                    animate={{
                                                        rotate:
                                                            openIndex === index
                                                                ? 180
                                                                : 0,
                                                    }}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}
                                                    className="w-[20px] h-[20px]"
                                                >
                                                    <svg
                                                        viewBox="0 0 25 24"
                                                        fill="none"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                    >
                                                        <path
                                                            d="M5.25383 15.7071C5.64435 16.0976 6.27752 16.0976 6.66804 15.7071L12.9609 9.41421L19.2538 15.7071C19.6444 16.0976 20.2775 16.0976 20.668 15.7071C21.0586 15.3166 21.0586 14.6834 20.668 14.2929L13.668 7.29289C13.2775 6.90237 12.6444 6.90237 12.2538 7.29289L5.25383 14.2929C4.86331 14.6834 4.86331 15.3166 5.25383 15.7071Z"
                                                            fill="currentColor"
                                                        ></path>
                                                    </svg>
                                                </motion.span>
                                            )}
                                        </span>
                                    </a>
                                    {/* Dropdown menu với hiệu ứng mượt */}
                                    {item.subItems && (
                                        <AnimatePresence>
                                            {openIndex === index && (
                                                <motion.div
                                                    className="bg-white min-w-[180px] absolute z-50 rounded-lg mt-[15px] border border-sky-400 shadow-md"
                                                    initial={{
                                                        opacity: 0,
                                                        y: -10,
                                                    }}
                                                    animate={{
                                                        opacity: 1,
                                                        y: 0,
                                                    }}
                                                    exit={{ opacity: 0, y: 10 }}
                                                    transition={{
                                                        duration: 0.3,
                                                    }}
                                                >
                                                    <ul className="text-[#003553] font-roboto text-[12px]">
                                                        {item.subItems &&
                                                            item.subItems.map(
                                                                (
                                                                    subItem: any,
                                                                    idx: number
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            idx
                                                                        }
                                                                        className="hover:bg-sky-100 hover:rounded-lg hover:text-sky-400 p-[10px]"
                                                                    >
                                                                        <Link
                                                                            to={writeUrl(
                                                                                subItem.canonical,
                                                                                item.model,
                                                                                subItem.id
                                                                            )}
                                                                        >
                                                                            {
                                                                                subItem.name
                                                                            }
                                                                        </Link>
                                                                    </li>
                                                                )
                                                            )}
                                                    </ul>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    )}
                                </li>
                            ))}
                            <li>
                                <Link to="/chatAI">
                                    <span className="flex items-center gap-2 text-base font-medium hover:text-sky-400">
                                        <p className="text-red mb-0 font-montserrat font-semibold hover:text-sky-400">
                                            Trợ lý AI
                                        </p>
                                    </span>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    {patientRedux && patientRedux !== null ? (
                        <div className="col-span-2 items-center grid place-items-center">
                            <DropdownMenu modal={false}>
                                <DropdownMenuTrigger className="flex">
                                    <Avatar className="mr-3">
                                        <AvatarImage src={patientRedux.image} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className="profile-content text-left">
                                        <div className="font-semibold">
                                            {patientRedux.name}
                                        </div>
                                        <div className="role text-xs text-[#536485]">
                                            {patientRedux.patient_catalogues}
                                        </div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="top-[1px]">
                                    <DropdownMenuLabel>
                                        Cài đặt tài khoản
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="flex items-center text-[#333335] cursor-pointer">
                                        <CgProfile className="mr-2 text-[18px]" />
                                        <div onClick={() => handleOpenSheet()}>
                                            Thay đổi thông tin
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex items-center text-[#333335] cursor-pointer">
                                        <FaHistory className="mr-2 text-[18px]" />
                                        <Link
                                            to={`/homepage/history/${patientRedux.id}.html`}
                                        >
                                            Lịch sử khám
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="flex items-center text-[#333335] cursor-pointer"
                                        onClick={() => {
                                            handleLogout();
                                        }}
                                    >
                                        <IoExitOutline className="mr-2 text-[18px]" />
                                        Đăng xuất
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    ) : patientRedux === null && patientContext !== null ? (
                        <div className="col-span-2 items-center grid place-items-end">
                            <Link
                                className="hover:text-[white] flex text-white text-center px-[10px] mr-[10px] w-[50%] py-[5px] bg-sky-300 rounded-lg font-semibold hover:bg-sky-400"
                                to={canonical.patinetSignIn}
                            >
                                <CgProfile className="mr-2 text-[18px]" />
                                Tài khoản
                            </Link>
                            {/* <Link className='hover:text-[white] text-white px-[10px] text-center w-[50%] py-[5px] bg-sky-300 rounded-lg font-semibold hover:bg-sky-400' to={`/patient/signup`}>
                                    Đăng ký
                                </Link> */}
                        </div>
                    ) : (
                        patientContext === undefined ||
                        (patientContext === null && (
                            <div className="col-span-2 items-center grid place-items-center">
                                <LoadingSpinner className="mr-[5px]" />
                                Loading...
                            </div>
                        ))
                    )}
                    {/* </div> */}
                </div>
            </header>
            {isSheetOpen && (
                <CustomSheet
                    title={`Sửa thông tin cá nhân`}
                    description={`Đây là form sửa thông tin cá nhân`}
                    isSheetOpen={isSheetOpen.open}
                    closeSheet={closeSheet}
                    className="w-[400px] sm:w-[500px]"
                >
                    <UpdatePatient
                        closeSheet={closeSheet}
                        id={isSheetOpen.id}
                        action={isSheetOpen.action}
                    />
                </CustomSheet>
            )}
        </>
    );
};
export default Header;
