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
const Header = () => {
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
                                        <AvatarImage src="https://github.com/shadcn.png" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className="profile-content text-left">
                                        <div className="font-semibold">Nam Hoàng Văn</div>
                                        <div className="role text-xs text-[#536485]">Administrator</div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="top-[1px]">
                                    <DropdownMenuLabel>Cài đặt tài khoản</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="flex items-center text-[#333335] cursor-pointer">
                                        <CgProfile className="mr-2 text-[18px]" />
                                        Thay đổi thông tin
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex items-center text-[#333335] cursor-pointer">
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