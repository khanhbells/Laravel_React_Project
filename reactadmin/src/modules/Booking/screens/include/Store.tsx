//CORE REACT
import { useQuery } from "react-query";
//COMPONENT
import LoadingButton from "@/components/LoadingButton";
//HOOK
import useFormSubmit from "@/hook/useFormSubmit";
import useSetFormValue from "@/hook/useSetFormValue";
import { FormProvider, useForm } from "react-hook-form";
//SETTING
import { UpdateStatusBooking } from "@/interfaces/types/BookingType";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
//SERVICE
import { getBookingById, IBooking, save } from "@/service/BookingService";
//INTERFACES
import CustomSelectBox from "@/components/CustomSelectBox";
import { UserCatalogueStoreProps } from "@/interfaces/UserCatalogueInterface";
import { useEffect, useMemo, useState } from "react";
//SETTINGS
import BookingDoctorSchedule from "@/components/BookingDoctorSchedule";
import BookingInforPatient from "@/components/BookingInforPatient";
import { optionPaymentStatus, optionStatus } from "../../setting";



const Store = ({ id, action, refetch, closeSheet }: UserCatalogueStoreProps) => {
    const schema = yup.object().shape({
        status: yup.string().required('Bạn chưa chọn trạng thái đơn đặt lịch khám'),
        payment_status: yup.string().required('Bạn chưa chọn trạng thái thanh toán')
    })

    //useForm
    const methods = useForm<UpdateStatusBooking>({
        context: { action },
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    });
    const { register, handleSubmit, reset, formState: { errors }, setValue, control } = methods
    const { onSubmitHanler, loading } = useFormSubmit(save, { action: action, id: id }, null, refetch, closeSheet)

    const { data, isLoading, isError } = useQuery<IBooking>(['bookings', id],
        () => getBookingById(id),
        {
            enabled: action === 'update' && !!id,
        }
    )

    const [isValueStatus, setValueStatus] = useState({ value: '', label: '' })
    const [isValuePaymentStatus, setValuePaymentStatus] = useState({ value: '', label: '' })

    const status = useMemo(() => {
        if (data && data.status) {
            const valueStatus = optionStatus.find((item) => item.value === data.status);
            return valueStatus || optionStatus[0]; // Trả về giá trị mặc định nếu không tìm thấy
        }
        return optionStatus[0]; // Giá trị mặc định
    }, [data]);

    const paymentStatus = useMemo(() => {
        if (data && data.payment_status) {
            const valuePaymentStatus = optionPaymentStatus.find((item) => item.value === data.payment_status);
            return valuePaymentStatus || optionPaymentStatus[0]; // Trả về giá trị mặc định nếu không tìm thấy
        }
        return optionPaymentStatus[0]; // Giá trị mặc định
    }, [data]);

    useEffect(() => {
        if (status && paymentStatus) {
            setValueStatus(status);
            setValuePaymentStatus(paymentStatus);
        }
    }, [status, paymentStatus])

    //follow data seen update
    //Set value cho input update để gửi dữ liệu
    useSetFormValue({
        isLoading,
        data,
        action,
        setValue
    })
    return (
        <>
            <BookingInforPatient
                data={data}
            />
            <BookingDoctorSchedule
                data={data}
            />
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitHanler)}>
                    <div className="flex flex-wrap">
                        <CustomSelectBox
                            name="status"
                            options={optionStatus}
                            placeholder="Trạng thái đơn đặt lịch khám"
                            title="Trạng thái đơn đặt lịch khám"
                            value={isValueStatus}
                            control={control} // <-- Thêm thuộc tính control
                            errors={errors} // <-- Để hiển thị lỗi nếu có
                        />
                        <div className="mt-[10px]">
                            <CustomSelectBox
                                name="payment_status"
                                options={optionPaymentStatus}
                                placeholder="Trạng thái thanh toán"
                                title="Trạng thái thanh toán"
                                value={isValuePaymentStatus}
                                control={control} // <-- Thêm thuộc tính control
                                errors={errors} // <-- Để hiển thị lỗi nếu có
                            />
                        </div>
                    </div>
                    <div className="mt-[30px] float-right">
                        <LoadingButton
                            loading={loading}
                            text="Lưu thông tin"
                        />
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default Store