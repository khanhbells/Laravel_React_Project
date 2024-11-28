import { HiBars3CenterLeft } from "react-icons/hi2";
import { IoIosSearch } from "react-icons/io";
import { Link } from "react-router-dom";
import { PiHospitalThin } from "react-icons/pi";
import { PiBellSimpleThin } from "react-icons/pi";
import { CiGrid41 } from "react-icons/ci";
import { BsFullscreenExit } from "react-icons/bs";
import { CgProfile } from "react-icons/cg";
import { IoExitOutline } from "react-icons/io5";
import { HiOutlineCog } from "react-icons/hi";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "../components/ui/dropdown-menu"
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "../components/ui/avatar"
const Header = () => {
    return (
        <>
            <header className="app-header h-14 fixed w-full content-center items-center top-0 bg-white">
                <div className="main-header mx-auto px-15px h-full flex justify-between items-center">
                    <HiBars3CenterLeft className="text-30px cursor-pointer" />
                    <div className="header-right-content flex justify-between items-center">
                        <div className="header-search">
                            <Link to="/" className="header-link flex relative">
                                <IoIosSearch className="cursor-pointer text-xl header-link-icon" />
                            </Link>
                        </div>
                        <div className="cart-dropdown">
                            <Link to="/" className="header-link flex relative">
                                <PiHospitalThin className="cursor-pointer header-link-icon" />
                                <span className="badge absolute top-2 top-[2px] right-[2px] text-[10px] font-semibold text-white w-[14px] h-[15px] text-center rounded-full bg-primary">5</span>
                            </Link>
                        </div>
                        <div className="notification-dropdown">
                            <Link to="/" className="header-link flex relative">
                                <PiBellSimpleThin className="cursor-pointer header-link-icon" />
                                <span className="badge absolute top-2 top-[2px] right-[2px] text-[10px] font-semibold text-white w-[14px] h-[15px] text-center rounded-full bg-second">5</span>
                            </Link>
                        </div>
                        <div className="shortcut-dropdown">
                            <Link to="/" className="header-link flex">
                                <CiGrid41 className="cursor-pointer header-link-icon" />
                            </Link>
                        </div>
                        <div className="fullscreen">
                            <Link to="/" className="header-link flex">
                                <BsFullscreenExit className="cursor-pointer header-link-icon" />
                            </Link>
                        </div>
                        <div className="profile">
                            <DropdownMenu >
                                <DropdownMenuTrigger className="flex">
                                    <Avatar className="mr-3">
                                        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className="profile-content text-left">
                                        <div className="font-semibold">Vũ Bảo Khánh</div>
                                        <div className="role text-[#536485]">Administrator</div>
                                    </div>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="top-[1px]">
                                    <DropdownMenuLabel>Cài đặt tài khoản</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem className="flex items-center text-[#333335] cursor-pointer">
                                        <CgProfile className="mr text-[18px]" />
                                        Thay đổi thông tin
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="flex items-center text-[#333335] cursor-pointer">
                                        <IoExitOutline className="mr text-[18px]" />
                                        Đăng xuất
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                        <div className="header-setting">
                            <div className="header-link flex">
                                <HiOutlineCog className="header-link-icon cursor-pointer animate-spin spin-slow" />
                            </div>
                        </div>
                    </div>
                </div>
            </header>
        </>
    )
}
export default Header