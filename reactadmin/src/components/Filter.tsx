//REACT
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
//COMPONENT
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select"
import { FiPlus } from "react-icons/fi";
import { Input } from "../components/ui/input"
import { Button } from "../components/ui/button"
import CustomAlertDialog from "@/components/CustomAlertDialog";
import CustomFilter from "./CustomFilter";
//SETTINGS
import { FilterProps } from "@/interfaces/BaseServiceInterface";
import { perpages, publishs, sort } from "../constant/general";
import { showToast } from "../helper/myHelper"
import { clearToast } from "../redux/slide/toastSlice"
//HOOK
import useFilterAction from "@/hook/useFilterAction";
import useDebounce from "@/hook/useDebounce";


interface FilterInterface {
    perpage: string | undefined,
    publish: string | undefined,
    parent_id: string | undefined
}

const Filter = ({
    isAnyChecked,
    checkedState,
    model,
    refetch,
    handleQueryString,
    openSheet,
    items,
    buttonText
}: FilterProps) => {

    const dispatch = useDispatch()
    const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false)

    const [actionSelectedValue, setActionSelectedValue] = useState<string>('')
    const [searchParams, setSearchParams] = useSearchParams()
    const [filters, setFilters] = useState<FilterInterface>({
        perpage: searchParams.get('perpage') || '10',
        publish: searchParams.get('publish') || undefined,
        parent_id: searchParams.get('parent_id') || undefined
    })

    const [keyword, setKeyword] = useState<string>(searchParams.get('keyword') || '')
    const { actionSwitch } = useFilterAction()

    //Open dialog
    const openAlertDialog = (value: string) => {
        // console.log(value);
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


    //
    const detectButtonAction = () => {
        openSheet({ open: true, action: '', id: null })
    }


    return (
        <>
            <div className="mb-[15px]">

                {alertDialogOpen && (
                    <CustomAlertDialog
                        isOpen={alertDialogOpen}
                        title="Bạn có chắc chắn muốn thực hiện chức năng này?"
                        description="Hành động này là không thể đảo ngược được! Hãy chắc chắn rằng bạn muốn thực hiện chức năng này"
                        closeAlertDialog={closeAlertDialog}
                        confirmAction={() => confirmAction(actionSelectedValue)}
                    />
                )}

                <div className="flex justify-between items-center">
                    <div className="filter-action">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                {isAnyChecked && (
                                    <div className="mr-[10px]">
                                        <Select onValueChange={(value) => openAlertDialog(value)}>
                                            <SelectTrigger className="w-[150px]">
                                                <SelectValue placeholder="Chọn thao tác" />
                                            </SelectTrigger>
                                            <SelectContent >
                                                {items && items.map((item) => (
                                                    <SelectItem className="cursor-pointer flex" value={item.value}>
                                                        <div className="flex items-center">
                                                            {item.icon}
                                                            {item.label}
                                                        </div>
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                )}
                                <div className="mr-[10px]">
                                    <Select onValueChange={(value) => handleFilter(value, 'perpage')} defaultValue={filters.perpage}>
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
                                    <Select onValueChange={(value) => handleFilter(value, 'publish')} defaultValue={filters.publish}>
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
                                    <Select onValueChange={(value) => handleFilter(value, 'sort')} >
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Sắp xếp theo" />
                                        </SelectTrigger>
                                        <SelectContent >
                                            {sort && sort.map((item, index) => (
                                                <SelectItem className="cursor-pointer" value={String(item.value)} key={index}>
                                                    {item.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="mr-[10px]">
                                    <Input
                                        type="email"
                                        placeholder="Nhập từ khóa tìm kiếm..."
                                        className="w-[200px]"
                                        onChange={(e) => {
                                            debounceInputSearch(e.target.value)
                                        }}
                                        defaultValue={keyword}
                                    />
                                </div>
                            </div>

                        </div>


                    </div>
                    <div>
                        <Button
                            className="p-0 bg-primary text-white px-[15px] flex justify-between items-center text-[12px]"
                            onClick={() => detectButtonAction()}
                        >
                            <FiPlus
                                className="mr-[5px]"
                            />
                            {buttonText}
                        </Button>
                    </div>
                </div>
                <CustomFilter
                    handleFilter={handleFilter}
                />
            </div >
        </>
    )
}

export default Filter