import { HiOutlineBars3CenterLeft, HiOutlineCog6Tooth } from "react-icons/hi2";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import { FiShoppingCart } from "react-icons/fi";
import { GoBell } from "react-icons/go";
import { IoGridOutline, IoExitOutline } from "react-icons/io5";
import { BsFullscreenExit } from "react-icons/bs";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { CgProfile } from "react-icons/cg";
import { FaHome } from "react-icons/fa";
//CONTEXT
import { useUserContext } from "@/contexts/UserContext";
//API
import { logout } from "@/service/BaseService";
import { useDispatch } from "react-redux";
import { setAuthLogout } from "@/redux/slide/authSlice";
import { canonical } from "@/constant/canonical";
const Header = () => {
    const dispatch = useDispatch();
    const { user, setUser } = useUserContext();

    const handleLogout = async () => {
        try {
            const response = await logout();
            if (response?.status === 200) {
                setUser(null);
                dispatch(setAuthLogout());
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }

    }
    return (
        <>
            <header className="app-header h-14 fixed z-10 w-full content-center items-center top-0 bg-white border border-solid border-[#f3f3f3] ">
                <div className="main-header mx-auto px-15px h-full flex justify-between items-center">
                    <HiOutlineBars3CenterLeft className="text-30px cursor-pointer" />
                    <div className="header-right-content flex justify-between items-center">
                        <div className="header-search">
                            <Link to="/" className="header-link flex relative">
                                <IoIosSearch className="cursor-pointer text-[20px] header-link-icon text-[30px] font-semibold" />
                            </Link>
                        </div>
                        <div className="cart-dropdown">
                            <Link to="/" className="header-link flex relative">
                                <FiShoppingCart className="cursor-pointer header-link-icon" />
                                <span className="badge absolute top-[6px] right-[6px] text-[10px] text-white font-semibold w-[14px] h-[15px] text-center rounded-full bg-primary">5</span>
                            </Link>
                        </div>
                        <div className="notification-dropdown">
                            <Link to="/" className="header-link flex relative">
                                <GoBell className="cursor-pointer header-link-icon" />
                                <span className="badge absolute top-[6px] right-[6px] text-[10px] text-white font-semibold w-[14px] h-[15px] text-center rounded-full bg-second">5</span>
                            </Link>
                        </div>
                        <div className="shortcut-dropdown">
                            <Link to="/" className="header-link flex">
                                <IoGridOutline className="cursor-pointer header-link-icon" />
                            </Link>
                        </div>
                        <div className="fullscreen">
                            <Link to="/" className="header-link flex">
                                <BsFullscreenExit className="cursor-pointer header-link-icon" />
                            </Link>
                        </div>
                        <div className="profile">
                            <DropdownMenu>
                                <DropdownMenuTrigger className="flex">
                                    <Avatar className="mr-3">
                                        <AvatarImage src={user?.image} />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className="profile-content text-left">
                                        <div className="font-semibold">{user?.name}</div>
                                        <div className="role text-xs text-[#536485]">{user?.user_catalogues}</div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="top-[1px]">
                                    <DropdownMenuLabel>Cài đặt tài khoản</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="flex items-center text-[#333335] cursor-pointer">
                                        <CgProfile className="mr-2 text-[18px]" />
                                        <Link to={`/user/doctor/update/${user?.id}`}>Thay đổi thông tin</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex items-center text-[#333335] cursor-pointer">
                                        <FaHome className="mr-2 text-[18px]" />
                                        <Link to={`${canonical.homepage}`}>Trang chủ</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex items-center text-[#333335] cursor-pointer" onClick={() => { handleLogout() }}>
                                        <IoExitOutline className="mr-2 text-[18px]" />
                                        Đăng xuất
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="header-setting">
                            <div className="header-link flex">
                                <HiOutlineCog6Tooth className="header-link-icon cursor-pointer spin-slow" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}
export default Header