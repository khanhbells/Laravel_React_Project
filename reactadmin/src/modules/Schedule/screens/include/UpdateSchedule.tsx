//CORE REACT
import { memo } from "react";
import { Controller } from "react-hook-form";
import { useQuery } from "react-query";
//COMPONENT
import CustomDatePicker from "@/components/CustomDatePicker";
import CustomInput from "@/components/CustomInput";
import CustomTimePicker from "@/components/CustomTimePicker";
import LoadingButton from "@/components/LoadingButton";
import Select from "react-select";
//HOOK
import useFormSubmit from "@/hook/useFormSubmit";
import useSetFormValue from "@/hook/useSetFormValue";
import { FormProvider, useForm } from "react-hook-form";
//SETTING
import { Schedule, SchedulePayloadInput } from "@/interfaces/types/ScheduleType";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { options } from "../../settings";
//SERVICE
import { findById, save } from "@/service/ScheduleService";
//INTERFACES
import { StoreProps } from "@/interfaces/BaseServiceInterface";



const UpdateSchedule = ({ id, action, refetch, closeSheet }: StoreProps) => {
    const schema = yup.object().shape({
        doctor_id: yup.string().optional(),
        user_id: yup.string().required("Bác sĩ là bắt buộc"),
        time_slots: yup.array().of(
            yup.object().shape({
                time_slot_id: yup.string().required("Thời gian là bắt buộc"),
                price: yup.string().required("Giá tiền là bắt buộc").min(4, "Giá tiền không thể nhỏ hơn 0"),
            })
        ).required("Danh sách thời gian là bắt buộc"),
        date: yup.string().required("Ngày khám bệnh là bắt buộc"),
        publish: yup.string().optional(),
        status: yup.string().optional()
    })

    //useForm
    const methods = useForm<SchedulePayloadInput>({
        context: { action },
        resolver: yupResolver(schema),
        mode: 'onSubmit',
        defaultValues: {
            time_slots: [
                { time_slot_id: 'null', price: 'null' }, // Giá trị mặc định
            ],
        },

    });
    const { register, handleSubmit, reset, formState: { errors }, setValue, control } = methods
    const { onSubmitHanler, loading } = useFormSubmit(save, { action: action, id: id }, null, 'schedules', closeSheet)

    const { data, isLoading, isError } = useQuery<Schedule>(['schedules', id],
        () => findById(id),
        {
            enabled: action === 'update' && !!id,
        }
    )

    //follow data seen update
    //Set value cho input update để gửi dữ liệu
    useSetFormValue({
        isLoading,
        data,
        action,
        setValue
    })
    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitHanler)}>
                <div className="grid gap-4 py-4">
                    <CustomTimePicker
                        name="start_time"
                        label="Thời gian bắt đầu"
                        readOnly={true}
                    />
                    <CustomTimePicker
                        name="end_time"
                        label="Thời gian kết thúc"
                        readOnly={true}
                    />
                    <CustomDatePicker
                        name="date"
                        label="Ngày khám bệnh"
                    />
                    <CustomInput
                        label="Giá tiền"
                        name="price"
                        type="text"
                        value={data && data.price}
                    />
                    <Controller
                        name="status"
                        // control={control}
                        // defaultValue={defaultParentValue?.value || null}
                        render={({ field }) => (
                            <Select
                                options={options}
                                className="w-full text-[12px]"
                                placeholder={"Tình trạng lịch khám"}
                                onChange={(selected) => {
                                    field.onChange(selected?.value)
                                }}
                                value={options?.find(option => option.value === field.value) || null}
                            />
                        )}
                    />
                </div>
                <div className="text-right">
                    <LoadingButton
                        loading={loading}
                        text="Lưu thông tin"
                    />
                </div>
            </form>
        </FormProvider>
    )
}

export default memo(UpdateSchedule)