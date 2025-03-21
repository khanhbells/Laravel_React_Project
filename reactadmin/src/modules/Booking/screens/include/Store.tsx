//CORE REACT
import { useQuery } from "react-query";
//COMPONENT
import LoadingButton from "@/components/LoadingButton";
import { Button } from "@/components/ui/button";
import BookingDoctorSchedule from "@/components/BookingDoctorSchedule";
import BookingInforPatient from "@/components/BookingInforPatient";
//HOOK
import useFormSubmit from "@/hook/useFormSubmit";
import useSetFormValue from "@/hook/useSetFormValue";
import { FormProvider, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
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

import { optionPaymentStatus, optionStatus } from "../../settings";

import { endpoint } from "@/constant/endpoint";
import BookingMedicine from "@/components/BookingMedicine";



const Store = ({ id, action, refetch, closeSheet }: UserCatalogueStoreProps) => {

    const navigate = useNavigate();

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
    const [data, setData] = useState<any>();


    const { data: dataBooking, isLoading, isError } = useQuery<IBooking>(['bookings', id],
        () => getBookingById(id),
        {
            enabled: action === 'update' && !!id,
        }
    )

    useEffect(() => {
        if (!isLoading && dataBooking && dataBooking.bookings) {
            setData(dataBooking.bookings)
        }
    }, [dataBooking, isLoading])

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
    useSetFormValue({
        isLoading,
        data,
        action,
        setValue
    })

    //handle booking medicine
    const handleBookingMedicine = () => {
        navigate(`/booking/medicine/${data?.id}`)
    }
    return (
        <>
            <BookingInforPatient
                data={data}
            />
            <BookingDoctorSchedule
                data={data}
            />
            {
                data && data.medicines && data.medicines.length > 0 &&
                <BookingMedicine
                    data={data}
                />
            }
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitHanler)}>
                    <div className="">
                        {
                            isValueStatus.value === 'confirm' ? (
                                <div className="font-semibold text-[green]">Đã xác nhận đơn đặt lịch khám</div>
                            ) : isValueStatus.value === 'stop' ? (
                                <div className="font-semibold text-[red]">Đã hủy đơn đặt lịch khám</div>
                            ) : (
                                <div className="pb-[30px]">
                                    <CustomSelectBox
                                        name="status"
                                        options={optionStatus}
                                        placeholder="Trạng thái đơn đặt lịch khám"
                                        title="Trạng thái đơn đặt lịch khám"
                                        value={isValueStatus}
                                        control={control} // <-- Thêm thuộc tính control
                                        errors={errors} // <-- Để hiển thị lỗi nếu có
                                    />
                                </div>
                            )
                        }
                        {
                            isValuePaymentStatus.value === 'confirm' ? (
                                <div className="font-semibold text-[green] mt-[10px]">Đã thanh toán</div>
                            ) : data?.payment_status === 'stop' ? (
                                <div className="font-semibold text-[red] mt-[10px]">Đã hủy thanh toán</div>
                            ) : (
                                <CustomSelectBox
                                    name="payment_status"
                                    options={optionPaymentStatus}
                                    placeholder="Trạng thái thanh toán"
                                    title="Trạng thái thanh toán"
                                    value={isValuePaymentStatus}
                                    control={control} // <-- Thêm thuộc tính control
                                    errors={errors} // <-- Để hiển thị lỗi nếu có
                                />
                            )
                        }

                    </div>
                    <div className="flex justify-between">
                        {
                            isValueStatus.value === 'confirm' && isValuePaymentStatus.value === 'confirm' && data?.medicines?.length === 0 &&
                            (
                                <div className="mt-[30px] float-right">
                                    <Button
                                        type="button"
                                        className="text-xs bg-yellow-500 text-white hover:bg-orange-500 py-2 rounded-md"
                                        onClick={() => handleBookingMedicine()}
                                    >
                                        Kê đơn thuốc
                                    </Button>
                                </div>
                            )
                        }
                        <div className="mt-[30px] float-right">
                            <LoadingButton
                                loading={loading}
                                text="Lưu thông tin"
                            />
                        </div>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default Store