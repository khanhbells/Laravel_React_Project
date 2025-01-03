import { FaHome, FaUser } from "react-icons/fa"
import { IoNewspaperOutline } from "react-icons/io5";
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
                    }
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
                    // {
                    //     title: 'Thành viên',
                    //     to: '/user/index'
                    // }
                ]
            },
        ],
    }
]