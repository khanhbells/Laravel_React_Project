import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select"
import { FaXmark } from "react-icons/fa6"
import { IoCheckmarkSharp } from "react-icons/io5";
import { AiOutlineStop } from "react-icons/ai";
import { perpages, publishs } from "../constant/general";
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Link } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { FilterProps } from "@/interfaces/BaseServiceInterface";
import { useEffect, useState } from "react";
import useFilterAction from "@/hook/useFilterAction";
import CustomAlertDialog from "@/components/CustomAlertDialog";
import { useDispatch, useSelector } from "react-redux";
import { showToast } from "../helper/myHelper"
import { clearToast } from "../redux/slide/toastSlice"
import useDebounce from "@/hook/useDebounce";

interface FilterInterface {
    perpage: string | number,
    publish: string | number,
    parent_id: string | number
}

const Filter = ({ isAnyChecked, checkedState, model, refetch, handleQueryString }: FilterProps) => {

    const dispatch = useDispatch()
    const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false)

    const [actionSelectedValue, setActionSelectedValue] = useState<string>('')
    const [filters, setFilters] = useState<FilterInterface>({
        perpage: '',
        publish: 0,
        parent_id: 0
    })

    const [keyword, setKeyword] = useState<string>('')

    const { actionSwitch } = useFilterAction()

    //Open dialog
    const openAlertDialog = (value: string) => {
        setAlertDialogOpen(true)
        setActionSelectedValue(value)
    }
    const closeAlertDialog = () => {
        setAlertDialogOpen(false)
        setActionSelectedValue('')
    }
    const confirmAction = async (value: string): Promise<void> => {
        const [action, selectedValue] = value.split('|')
        const response = await actionSwitch(action, selectedValue, { checkedState }, model, refetch)
        closeAlertDialog()
        showToast(response?.message, 'success')
        dispatch(clearToast())
    }



    //Delay keyword
    const { debounce } = useDebounce()

    const debounceInputSearch = debounce((value: string) => {
        setKeyword(value)
    }, 300)

    useEffect(() => {
        handleQueryString({ ...filters, keyword: keyword })
    }, [keyword])




    //Change filter
    const handleFilter = (value: string, field: string) => {
        setFilters(prevFilter => ({ ...prevFilter, [field]: value }))

    }
    useEffect(() => {
        handleQueryString({ ...filters, keyword: keyword })
    }, [filters])




    return (
        <>
            <div className="mb-[15px]">
                <CustomAlertDialog
                    isOpen={alertDialogOpen}
                    title="Bạn có chắc chắn muốn thực hiện chức năng này?"
                    description="Hành động này là không thể đảo ngược được! Hãy chắc chắn rằng bạn muốn thực hiện chức năng này"
                    closeAlertDialog={closeAlertDialog}
                    confirmAction={() => confirmAction(actionSelectedValue)}
                />
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <div className="mr-[10px]">
                            {isAnyChecked && (
                                <Select onValueChange={(value) => openAlertDialog(value)}>
                                    <SelectTrigger className="w-[150px]">
                                        <SelectValue placeholder="Chọn thao tác" />
                                    </SelectTrigger>
                                    <SelectContent >
                                        <SelectItem className="cursor-pointer flex" value="deleteAll">
                                            <div className="flex items-center">
                                                <FaXmark className="mr-[5px]" />
                                                Xóa
                                            </div>
                                        </SelectItem>
                                        <SelectItem className="cursor-pointer" value="publish|2">
                                            <div className="flex items-center">
                                                <IoCheckmarkSharp className="mr-[5px]" />
                                                Xuất bản
                                            </div>
                                        </SelectItem>
                                        <SelectItem className="cursor-pointer" value="publish|1">
                                            <div className="flex items-center">
                                                <AiOutlineStop className="mr-[5px]" />
                                                Ngừng xuất bản
                                            </div>
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            )}

                        </div>
                        <div className="mr-[10px]">
                            <Select onValueChange={(value) => handleFilter(value, 'perpage')}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Chọn số bản ghi" />
                                </SelectTrigger>
                                <SelectContent >
                                    {perpages && perpages.map((perpage, index) => (
                                        <SelectItem className="cursor-pointer" value={perpage} key={index}>
                                            {perpage} bản ghi
                                        </SelectItem>
                                    ))}

                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mr-[10px]">
                            <Select onValueChange={(value) => handleFilter(value, 'publish')}>
                                <SelectTrigger className="w-[150px]">
                                    <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                                <SelectContent >
                                    {publishs && publishs.map((publish, index) => (
                                        <SelectItem className="cursor-pointer" value={String(publish.id)} key={index}>
                                            {publish.name}
                                        </SelectItem>
                                    ))}

                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mr-[10px]">
                            <Select onValueChange={(value) => handleFilter(value, 'parent_id')}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Chọn danh mục cha" />
                                </SelectTrigger>
                                <SelectContent >
                                    <SelectItem className="cursor-pointer" value="0">
                                        Tất cả danh mục
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="mr-10">
                            <Input
                                type="email"
                                placeholder="Nhập từ khóa tìm kiếm..."
                                className="w-[200px]"
                                onChange={(e) => {
                                    debounceInputSearch(e.target.value)
                                }}
                            />
                        </div>
                    </div>
                    <div>
                        <Button className="p-0 bg-primary">
                            <Link to="/user/create" className="text-white px-[15px] flex justify-between items-center"><FiPlus className="mr-[5px]" /> Thêm mới thành viên</Link>
                        </Button>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Filter