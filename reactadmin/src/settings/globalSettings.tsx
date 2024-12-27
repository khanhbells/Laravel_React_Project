//COMPONENTS
import { FaXmark } from "react-icons/fa6"
import { IoCheckmarkSharp } from "react-icons/io5";
import { AiOutlineStop } from "react-icons/ai";
//INTERFACE & TYPE
import { BaseFilterItem } from "@/interfaces/BaseServiceInterface";
import { Select } from "@/interfaces/BaseServiceInterface";
//SETTINGS


const filterItems: BaseFilterItem[] = [
    {
        value: 'deleteAll',
        label: 'Xóa',
        icon: <FaXmark className="mr-[5px]" />
    },
    {
        value: 'publish|2',
        label: 'Xuất bản',
        icon: <IoCheckmarkSharp className="mr-[5px]" />
    },
    {
        value: 'publish|1',
        label: 'Ngừng xuất bản',
        icon: <AiOutlineStop className="mr-[5px]" />
    },
]

const extraFilterItems: Select[] = [
    {
        id: 'user_catalogue_Id',
        placeholder: 'Chọn Nhóm Thành Viên',
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
    extraFilterItems,
    filterItems
}