//REACT
import { memo, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
//COMPONENT
import CustomTimePicker from "@/components/CustomTimePicker";
import LoadingButton from "@/components/LoadingButton";
//SETTINGS
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
//HOOK
import useFormSubmit from "@/hook/useFormSubmit";
//API
import { save } from "@/service/TimeSlotService";
export type TTimeSlot = {
    start_time: string,
    end_time: string,
}

export interface ITimeSlot {
    close?: () => void,
    [key: string]: any
}
const schema = yup.object().shape({
    start_time: yup.string().required('Bạn chưa nhập vào thời gian bắt đầu'),
    end_time: yup.string().required('Bạn chưa nhập vào thời gian kết thúc'),
})
const CreateTimeSlot = ({
    close,
    ...restProps
}: ITimeSlot) => {
    //-------------------------------------
    const methods = useForm<TTimeSlot>({
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    })

    const { handleSubmit } = methods
    const { onSubmitHanler, loading, isSuccess, } = useFormSubmit(save, { action: '', id: '' })


    useEffect(() => {
        if (isSuccess) {
            restProps.setLoadingTimeSlot(true)
            close && close()
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

export default memo(CreateTimeSlot)