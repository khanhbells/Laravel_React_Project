//REACT
//COMPONENTS
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
//SETTINGS
import { TTag } from "@/interfaces/types/TagType";
//INTERFACE & TYPE
import { ActionParam, ButtonAction, OpenSheetFunction, Select } from "@/interfaces/BaseServiceInterface";
//HOOK


const breadcrumb = {

    index: {
        title: 'Quản lý tag',
        route: '/tag/index'
    },
    create: {
        title: 'Thêm mới tag',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
    },
    update: {
        title: 'Cập nhật thông tin',
        description: 'Nhập đầy đủ các thông tin dưới đây. Các mục có dấu (*) là bắt buộc',
    },

}

const model = 'tags'

interface tableColumn {
    name: string,
    render: (item: TTag) => JSX.Element
}


const tableColumn: tableColumn[] = [
    {
        name: 'Tên tag',
        render: (item: TTag) => <span>{item.name}</span>
    },
    {
        name: 'Đường dẫn',
        render: (item: TTag) => <span>{item.canonical}</span>
    },
    {
        name: 'Được chọn',
        render: (item: TTag) => <span className="">{item.posts_count}</span>
    },


]



const buttonActions: ButtonAction<ActionParam[]>[] = [
    {
        icon: <FaRegEdit className="text-white" />,
        className: 'flex mr-[5px]',
        method: 'create',
        params: ['id', 'openSheet:f'],
        onClick: (id: string, openSheet: OpenSheetFunction) => {
            openSheet({ open: true, action: 'update', id: id })
        }
    },
    {
        icon: <RiDeleteBin6Line className="text-white" />,
        className: 'bg-[#ec4758] mr-[5px]',
        method: 'delete',
        params: ['id', 'handleAlertDialog:f', 'destroy:f'],
        onClick: (id: string, handleAlertDialog: any, destroy: any) => {
            handleAlertDialog(id, destroy)
            // confirmAction(destroy)
        }
    },
]




const extraFilterItems: Select[] = [
    {
        id: 'user_catalogue_Id',
        placeholder: 'Chọn tag',
        items: [
            {
                value: '0',
                label: 'Tất cả các nhóm'
            },
            {
                value: '1',
                label: 'Admin'
            }
        ]
    }
]



export {
    breadcrumb, buttonActions,
    extraFilterItems, model,
    tableColumn
};

