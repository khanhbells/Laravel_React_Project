//REACT
import { useEffect, memo } from "react";
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
import { Link } from "react-router-dom";
import CustomFilterDatePicker from "./CustomFilterDatePicker";
//SETTINGS
import { FilterProps } from "@/interfaces/BaseServiceInterface";
import { perpages, publishs, sort } from "../constant/general";
//HOOK
import useFilterAction from "@/hook/useFilterAction";
import useDebounce from "@/hook/useDebounce";


const Filter = ({
    isAnyChecked,
    checkedState,
    model,
    refetch,
    handleQueryString,
    openSheet,
    items,
    buttonText,
    filterDate,
    ...restProps
}: FilterProps) => {
    //Delay keyword
    const { debounce } = useDebounce()
    const {
        alertDialogOpen,
        closeAlertDialog,
        confirmAction,
        actionSelectedValue,
        openAlertDialog, filters,
        keyword,
        handleFilter,
        debounceInputSearch
    } = useFilterAction(checkedState, model, refetch, debounce)



    useEffect(() => {
        handleQueryString({ ...filters, keyword: keyword })
    }, [keyword])

    useEffect(() => {
        handleQueryString({ ...filters, keyword: keyword })
    }, [filters])
    //openSheet
    const detectButtonAction = () => {
        if (openSheet) {
            openSheet({ open: true, action: '', id: undefined })
        }
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
                                    <Select onValueChange={(value) => handleFilter(value, 'sort')} defaultValue={filters.sort}>
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
                                <div className="mr-[10px]">
                                    {
                                        filterDate && filterDate === true && <CustomFilterDatePicker handleFilter={handleFilter} />
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-between">
                        {
                            restProps.permission
                                ?
                                <Link to={restProps.permission} className="p-0 bg-teal-500 mr-[10px] text-white px-[15px] flex justify-between items-center text-[12px] block p-[8px] rounded">
                                    <FiPlus className="mr-[5px]" />
                                    Phân quyền
                                </Link>
                                :
                                null
                        }
                        {
                            openSheet
                                ?
                                (
                                    <Button
                                        className="p-0 bg-primary text-white px-[15px] flex justify-between items-center text-[12px]"
                                        onClick={() => detectButtonAction()}>
                                        <FiPlus className="mr-[5px]" />
                                        {buttonText}
                                    </Button>
                                )
                                :
                                restProps.openDialog ? (
                                    <Button
                                        className="p-0 bg-primary text-white px-[15px] flex justify-between items-center text-[12px]"
                                        onClick={() => restProps.openDialog()}>
                                        <FiPlus className="mr-[5px]" />
                                        {buttonText}
                                    </Button>
                                ) :
                                    buttonText &&
                                    (
                                        <Link to={restProps.to} className="p-0 bg-primary text-white px-[15px] flex justify-between items-center text-[12px] block p-[10px] rounded">
                                            <FiPlus className="mr-[5px]" />
                                            {buttonText}
                                        </Link>
                                    )
                        }
                    </div>
                </div>
                <CustomFilter handleFilter={handleFilter} />

            </div >
        </>
    )
}

export default memo(Filter)