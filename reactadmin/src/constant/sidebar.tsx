import { FaHome, FaUser } from "react-icons/fa"
import { IoNewspaperOutline } from "react-icons/io5";
import { CiShoppingTag } from "react-icons/ci";
import { BsHospital } from "react-icons/bs";
import { MdOutlineMedicalServices } from "react-icons/md";
import { FaUserInjured } from "react-icons/fa6";
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
                icon: <BsHospital className="text-sm mr-2" />,
                active: ['hospital'],
                label: 'Quản Lý Bệnh Viện',
                path: '/hospital/index'
            },
            {
                icon: <CiShoppingTag className="text-sm mr-2" />,
                active: ['tag'],
                label: 'Quản Lý Tags',
                path: '/tag/index'
            },
        ],
    }
]