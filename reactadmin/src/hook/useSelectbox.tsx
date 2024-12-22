import { useState, useCallback } from "react"
import { SelectBoxItem } from "@/interfaces/BaseServiceInterface"
import { Option } from "@/components/CustomSelectBox"

const useSelectBox = (initialSelectBoxs: SelectBoxItem[]) => {

    const [selectBox, setSelectBox] = useState<SelectBoxItem[]>(initialSelectBoxs)

    //update select value
    const updateSelectBoxValue = useCallback((name: string, options: Option[], value: string | undefined) => {
        setSelectBox(prevSelectBox =>
            prevSelectBox.map(item =>
                item.name === name
                    ? { ...item, value: options.filter((option: Option) => option.value === value)[0] } : item
            )
        )
    }, [])

    //update select option
    const updateSelectBoxOptions = useCallback((name: string, newOptions: Option[]) => {
        setSelectBox(prevSelectBox =>
            prevSelectBox.map(item =>
                item.name === name
                    ? { ...item, options: newOptions }
                    : item
            )
        )
    }, [])

    return { selectBox, updateSelectBoxValue, updateSelectBoxOptions }
}

export default useSelectBox