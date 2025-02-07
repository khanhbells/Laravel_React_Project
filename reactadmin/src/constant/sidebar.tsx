import { FaHome, FaUser } from "react-icons/fa"
import { IoNewspaperOutline } from "react-icons/io5";
import { CiShoppingTag } from "react-icons/ci";
import { BsHospital } from "react-icons/bs";
import { MdOutlineMedicalServices } from "react-icons/md";
import { FaUserInjured } from "react-icons/fa6";
import { IoSettingsOutline } from "react-icons/io5";
import { GrSchedules } from "react-icons/gr";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { GiMedicines } from "react-icons/gi";
export const sidebarItem = [
    {
        label: 'MAIN',
        items: [
            {
                icon: <FaHome className="text-sm mr-2" />,
                active: ['dashboard'],
                label: 'Dashboard',
                links: [
                    {
                        title: 'Thống kê chung',
                        to: '/dashboard'
                    },
                    {
                        title: 'Thống kê chi tiết',
                        to: '/dashboard/order'
                    }
                ]
            }
        ]
    },
    {
        label: 'FUNCTION',
        items: [
            {
                icon: <FaUser className="text-sm mr-2" />,
                active: ['user'],
                label: 'Quản Lý Thành Viên',
                links: [
                    {
                        title: 'Nhóm thành viên',
                        to: '/user/catalogue/index'
                    },
                    {
                        title: 'Thành viên',
                        to: '/user/index'
                    },
                    {
                        title: 'Thông tin bác sĩ',
                        to: '/user/doctor/index'
                    },
                    {
                        title: 'Phân quyền',
                        to: '/user/permission/index'
                    },
                ]
            },
            {
                icon: <FaUserInjured className="text-sm mr-2" />,
                active: ['patient'],
                label: 'Quản Lý Bệnh Nhân',
                links: [
                    {
                        title: 'Nhóm bệnh nhân',
                        to: '/patient/catalogue/index'
                    },
                    {
                        title: 'Bệnh nhân',
                        to: '/patient/index'
                    },
                ]
            },
            {
                icon: <IoNewspaperOutline className="text-sm mr-2" />,
                active: ['post'],
                label: 'Quản Lý Bài Viết',
                links: [
                    {
                        title: 'Nhóm bài viết',
                        to: '/post/catalogue/index'
                    },
                    {
                        title: 'Bài viết',
                        to: '/post/index'
                    },
                ]
            },
            {
                icon: <GiMedicines className="text-sm mr-2" />,
                active: ['medicine'],
                label: 'Quản Lý Thuốc',
                links: [
                    {
                        title: 'Loại thuốc',
                        to: '/medicine/catalogue/index'
                    },
                    {
                        title: 'Thuốc',
                        to: '/medicine/index'
                    }
                ]
            },
            {
                icon: <MdOutlineMedicalServices className="text-sm mr-2" />,
                active: ['specialty'],
                label: 'QL Dịch Vụ Khám Bệnh',
                links: [
                    {
                        title: 'Nhóm dịch vụ khám',
                        to: '/specialty/catalogue/index'
                    },
                    {
                        title: 'Dịch vụ khám',
                        to: '/specialty/index'
                    }
                ]
            },
            {
                icon: <GrSchedules className="text-sm mr-2" />,
                active: ['schedule'],
                label: 'Quản Lý Lịch Khám BS',
                path: '/schedule/index'
            },
            {
                icon: <LiaFileInvoiceDollarSolid className="text-sm mr-2" />,
                active: ['booking'],
                label: 'Quản Đơn Đặt Lịch Khám',
                path: '/booking/index'
            },
            {
                icon: <BsHospital className="text-sm mr-2" />,
                active: ['hospital'],
                label: 'Quản Lý Bệnh Viện',
                path: '/hospital/index'
            },
            {
                icon: <IoSettingsOutline className="text-sm mr-2" />,
                active: ['setting'],
                label: 'Cài đặt chung',
                links: [
                    {
                        title: 'Thời gian khám',
                        to: '/setting/timeSlot/index'
                    },
                    {
                        title: 'Tags',
                        to: '/setting/tag/index'
                    },
                    {
                        title: 'Cấu hình hệ thống',
                        to: '/system/index'
                    },
                ]
            },
        ],
    }
]