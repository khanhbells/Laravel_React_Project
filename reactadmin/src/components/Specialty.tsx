//REACT
import { memo, useCallback, useEffect, useState } from "react";
import AsyncSelect from 'react-select/async';
//COMPONENT
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Controller, useFormContext } from "react-hook-form";
//HOOK
import useDebounce from "@/hook/useDebounce";
//QUERY
import { pagination } from "@/service/SpecialtyService";
//SETTINGS

const Specialty = () => {
    const { register, formState: { errors } } = useFormContext()
    const errorMessage = errors['specialties']?.message


    const { debounce } = useDebounce()

    const debounceSpecialtyData = debounce(async (inputValue: string, callback: (options: any) => void) => {
        if (inputValue.length) {
            const data = await pagination(`keyword=${inputValue}`)
            const options = data?.specialties?.map((specialty: any) => ({
                value: String(specialty.id),
                label: String(specialty.name)
            })) || []
            callback(options)
        }
    }, 300)

    const loadOptions = (
        inputValue: string,
        callback: (options: any) => void
    ) => {
        debounceSpecialtyData(inputValue, callback)
    }


    return (
        <>
            <Card className="rounded-[5px] mb-[20px]">
                <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                    <CardTitle className="uppercase">
                        <div className="flex justify-between">
                            <span>Dịch vụ khám</span>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-[10px]">
                    <div className="mt-[10px]">
                        <Controller
                            name="specialties"
                            defaultValue={[]}
                            render={({ field }) => {
                                return (
                                    <AsyncSelect
                                        cacheOptions
                                        loadOptions={loadOptions}
                                        onChange={(selected) => {
                                            field.onChange(selected || [])
                                        }}
                                        value={field.value || []}
                                        defaultOptions
                                        isMulti
                                    />
                                )
                            }}
                        />
                    </div>
                    <div className="error-line text-right ">
                        {typeof errorMessage === 'string' && (
                            <span className="text-red-500 text-xs">{errorMessage}</span>
                        )}
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default memo(Specialty)