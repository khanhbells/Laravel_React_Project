import { FaHome, FaUser } from "react-icons/fa"

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
                icon: <FaHome className="text-sm mr-2" />,
                active: ['user'],
                label: 'Quản Lý Thành Viên',
                links: [
                    {
                        title: 'Nhóm thành viên',
                        to: '/user/catalogue'
                    },
                    {
                        title: 'Thành viên',
                        to: '/user'
                    }
                ]
            }
        ]
    }
]