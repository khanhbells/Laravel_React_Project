import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { CheckStateInterface } from "@/interfaces/BaseServiceInterface";
import { updateFieldByParams, deleteAll } from "@/service/BaseService";

import { showToast } from "../helper/myHelper"
import { clearToast } from "../redux/slide/toastSlice"

import { CheckedState } from "./useCheckBoxState";



interface FilterInterface {
    perpage: string | undefined,
    publish: string | undefined,
    sort: string | undefined
}

const useFilterAction = (checkedState: CheckedState, model: string, refetch: any, debounce: any) => {

    const [searchParams, setSearchParams] = useSearchParams()
    const [filters, setFilters] = useState<FilterInterface>({
        perpage: searchParams.get('perpage') || '10',
        publish: searchParams.get('publish') || undefined,
        sort: searchParams.get('sort') || undefined,
        // parent_id: searchParams.get('parent_id') || undefined
    })
    const [keyword, setKeyword] = useState<string>(searchParams.get('keyword') || '')


    const [alertDialogOpen, setAlertDialogOpen] = useState<boolean>(false)
    const [actionSelectedValue, setActionSelectedValue] = useState<string>('')

    const actionSwitch = async (action: string, selectedValue: string, { checkedState }: CheckStateInterface, model: string, refetch: any) => {
        // Trong 1 danh sách các dữ liệu cần lọc ra 1 dữ liệu gì đấy dựa vào điều kiện thì dùng filter
        const ids = Object.keys(checkedState).filter((key) => checkedState[Number(key)])
        let response
        switch (action) {
            case 'deleteAll':
                response = await deleteAll(ids, model, refetch)
                break;
            case 'publish':
                response = await updateFieldByParams(action, ids, model, selectedValue, refetch)
                break;
        }

        return response

    }

    const confirmAction = async (value: string): Promise<void> => {
        const [action, selectedValue] = value.split('|')
        const response = await actionSwitch(action, selectedValue, { checkedState }, model, refetch)
        closeAlertDialog()
        showToast(response?.message, 'success')
    }

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

    //Change filter
    const handleFilter = (value: string, field: string) => {
        setFilters(prevFilter => ({ ...prevFilter, [field]: value }))
    }


    const debounceInputSearch = debounce((value: string) => {
        setKeyword(value)
    }, 300)


    return {
        actionSwitch,
        confirmAction,
        alertDialogOpen,
        actionSelectedValue,
        openAlertDialog,
        closeAlertDialog,
        filters,
        keyword,
        setKeyword,
        setFilters,
        handleFilter,
        debounceInputSearch
    }
}
export default useFilterAction