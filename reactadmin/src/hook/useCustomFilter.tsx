import { useState, useEffect, useCallback, useMemo } from "react";
import { SelectOption } from "@/interfaces/BaseServiceInterface";
import { SelectConfig } from "@/components/CustomFilter";
import { formatCatalogueName } from "@/helper/myHelper";

interface IFilterConfig<T = any> {
    name: string,
    placeholder: string,
    data: T[] | undefined
    isLoading?: boolean,
    valueKey?: keyof T,
    labelKey?: keyof T,
    isNested?: boolean
}

const mapDataToOptions = <T extends Record<string, any>>(
    data: T[],
    valueKey: keyof T = 'id',
    labelKey: keyof T = 'name',
    isNested: boolean = false
): SelectOption[] => {


    return data.map(item => ({
        value: String(item[valueKey]),
        label: (isNested) ? formatCatalogueName(item, String(labelKey)) : String(item[labelKey]),
    }))
}

export const useCustomFilter = <T extends Record<string, any>>(filters: IFilterConfig<T>[]): SelectConfig[] => {
    console.log(filters);

    const initialFilters = useMemo(() => filters.map(filter => ({
        name: filter.name,
        placeholder: filter.placeholder,
        options: [],
    })), [filters])

    const [customFilter, setCustomFilter] = useState<SelectConfig[]>(initialFilters)
    //
    const setCustomFilterCallback = useCallback(() =>
        filters.map(filter => ({
            name: filter.name,
            placeholder: filter.placeholder,
            options: filter.isLoading ? [] : [
                { value: '0', label: `${filter.placeholder}` },
                ...(filter.data ? mapDataToOptions(filter.data, filter.valueKey, filter.labelKey, filter.isNested) : [])
            ]
        }))
        , [filters])

    useEffect(() => {
        setCustomFilter(setCustomFilterCallback())
    }, [setCustomFilterCallback])

    return customFilter
}