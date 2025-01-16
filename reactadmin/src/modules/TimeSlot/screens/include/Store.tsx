//REACT
import { useState, memo, useEffect, useMemo } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useQuery } from "react-query";
//COMPONENT
import LoadingButton from "@/components/LoadingButton";
import CustomTimePicker from "@/components/CustomTimePicker";
//SETTINGS
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
//HOOK
import useFormSubmit from "@/hook/useFormSubmit";
//API
import { save, findById } from "@/service/TimeSlotService";
export type TTimeSlot = {
    start_time: string,
    end_time: string,
}
//CONTEXT
import { useTableContext } from "@/contexts/TableContext";


export interface ITimeSlot {
    close?: () => void,
    [key: string]: any
}

const schema = yup.object().shape({
    start_time: yup.string().required('Bạn chưa nhập vào thời gian bắt đầu'),
    end_time: yup.string().required('Bạn chưa nhập vào thời gian kết thúc'),
})
const Store = ({
    close,
    ...restProps
}: ITimeSlot) => {
    const model = "time_slots"
    //-------------------------------------
    const methods = useForm<TTimeSlot>({
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    })

    const currentAction = useMemo(() => restProps.id ? 'update' : '', [])
    const { handleSubmit, reset, formState: { errors } } = methods
    const { onSubmitHanler, loading, isSuccess, } = useFormSubmit(save, { action: currentAction, id: restProps.id })

    const { refetch } = useTableContext();

    const { data, isLoading, isError } = useQuery([model, restProps.id], () => findById(restProps.id), {
        enabled: !!restProps.id,
        onSuccess: (data) => {
            reset({
                start_time: String(data.start_time),
                end_time: String(data.end_time),
            })
        },
        staleTime: 3000
    })

    useEffect(() => {
        if (isSuccess) {
            close && close()
            refetch()
        }
    }, [isSuccess])

    return (
        <>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitHanler)}>
                    <div className="grid gap-[10px] py-4">
                        <CustomTimePicker
                            label="Thời gian bắt đầu"
                            name="start_time"
                        />
                        <CustomTimePicker
                            label="Thời gian kết thúc"
                            name="end_time"
                        />
                        <LoadingButton
                            loading={loading}
                            text="Thực hiện"
                        />
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default memo(Store)