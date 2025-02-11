

import { LoadingSpinner } from "@/components/ui/loading"
import { LuCalendarCheck } from "react-icons/lu";
import { useDataSchedule } from '@/contexts/DataScheduleContext';
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { RiHospitalLine } from "react-icons/ri";
import { Link } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import LoadingButton from "@/components/LoadingButton";
import CustomInput from "@/components/CustomInput";
import { yupResolver } from '@hookform/resolvers/yup'
import { PayloadBookingInput } from "@/interfaces/types/BookingType";
import * as yup from 'yup';
import { Option } from "@/components/CustomSelectBox";
import { SelectBoxItem } from "@/interfaces/BaseServiceInterface";
import useSelectBox from "@/hook/useSelectbox";
import CustomSelectBox from "@/components/CustomSelectBox";
import useLocationState from "@/hook/useLocationState";
import { formField, redirectIfSucces } from "../settings/patientBookingSetting";
import useFormSubmit from "@/hook/useFormSubmit";
import { save } from "@/service/Frontend/FrontEndService";
import CustomRadioGroup from "@/components/CustomRadioGroup";
import { addCommas } from "@/helper/myHelper";
import TotalPriceBooking from "@/components/TotalPriceBooking";
import InforScheduleBooking from "@/components/InforScheduleBooking";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux"
import { RootState } from "@/redux/store"
import { useQuery } from "react-query";
import { PatientBooking } from "@/types/Patient";
import { getPatientById } from "@/service/PatientService";
import { endpoint } from "@/constant/endpoint";
//img

interface IStoreBookingPatient {
    dataDoctor: any
    schedules: { value: string, label: string }[],
    closeSheet: () => void,
}
interface TimeSlot {
    [key: string]: any
}

const schema = yup.object().shape({
    doctor_id: yup.string().required('Chưa rõ thông tin bác sĩ'),
    schedule_id: yup.string().required('Chưa rõ thông tin lịch khám'),
    full_name: yup.string().required('Bạn chưa nhập vào Họ tên').min(3, 'Tên người dùng tối thiểu phải có 3 ký tự'),
    email: yup.string().required('Bạn chưa nhập vào Email').email('Email không hợp lệ'),
    phone: yup.string().required('Bạn chưa nhập vào số điện thoại'),
    gender: yup.string().required('Bạn chưa chọn giới tính'),
    birthday: yup.string().required('Bạn chưa nhập ngày tháng năm sinh'),
    province_id: yup.string().required('Bạn chưa chọn thành phố'),
    district_id: yup.string().required('Bạn chưa chọn quận/huyện'),
    ward_id: yup.string().required('Bạn chưa chọn phường/xã'),
    address: yup.string().optional(),
    note: yup.string().optional(),
    method: yup.string().required('Bạn chưa chọn hình thức thanh toán'),
    price_schedule: yup.string().optional(),
    total_price: yup.string().required('Chưa có thông tin tổng giá tiền'),
})

const StoreBookingPatient = ({
    dataDoctor,
    schedules,
    closeSheet
}: IStoreBookingPatient) => {

    //REDUX
    const { isAuthenticated, patient: patientRedux } = useSelector((state: RootState) => state.patient)

    const { selectedDataSchedule } = useDataSchedule()

    const navigate = useNavigate()
    //Location
    const { provinces, districts, wards, setProvinceId, setDistrictId, isProvinceLoading, isDistrictLoading, isWardLoading } = useLocationState()

    const schedule = useMemo(() => {
        if (!selectedDataSchedule || !selectedDataSchedule.date) return null;

        const dateSchedule = schedules.filter(
            (schedule: TimeSlot) => schedule.value === selectedDataSchedule.date
        );

        return dateSchedule.length > 0 ? dateSchedule[0].label : null;
    }, [schedules, selectedDataSchedule]);

    const methods = useForm<PayloadBookingInput>({
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    });

    //useForm
    const { register, handleSubmit, reset, formState: { errors }, setValue, control } = methods
    const { onSubmitHanler, loading, isSuccess, data } = useFormSubmit(save, { action: 'create', id: undefined }, null, null, closeSheet, endpoint.bookings)

    const [defaultSelectValue, _] = useState<Option | null>(null)

    //QUERY
    const { data: dataPatient, isLoading, isError } = useQuery<PatientBooking>(['patient', patientRedux?.id],
        () => getPatientById(patientRedux?.id),
        {
            enabled: !!patientRedux?.id,
        }
    )

    const [validationRules, setValidationRules] = useState(() => formField(undefined))

    //follow patient
    useEffect(() => {
        if (!isLoading && dataPatient) {
            setValidationRules(formField(dataPatient))
            Object.keys(dataPatient).forEach((key) => {
                const value = dataPatient[key as keyof PatientBooking]
                if (typeof value === 'string' || value === undefined) {
                    setValue(key as keyof PayloadBookingInput, value)
                } else {
                    setValue(key as keyof PayloadBookingInput, String(value))
                }

            })

        }
    }, [dataPatient])

    useEffect(() => {
        console.log(validationRules);

    }, [validationRules])

    const initialSelectBoxs = useMemo<SelectBoxItem[]>(() => [
        {
            title: 'Giới tính',
            placeholder: 'Chọn giới tính',
            options: [
                { 'value': '1', 'label': 'Nam' },
                { 'value': '2', 'label': 'Nữ' }
            ],
            value: defaultSelectValue,
            name: 'gender',
            control: control,
        },
        {
            title: 'Thành phố',
            placeholder: 'Chọn thành phố',
            options: [],
            value: defaultSelectValue,
            onSelectChange: (value: string | undefined) => {
                setProvinceId(value)
            },
            name: 'province_id',
            control: control,
        },
        {
            title: 'Quận/Huyện',
            placeholder: 'Chọn Quận/Huyện',
            options: [],
            value: defaultSelectValue,
            onSelectChange: (value: string | undefined) => setDistrictId(value),
            isLoading: isDistrictLoading,
            name: 'district_id',
            control: control,
        },
        {
            title: 'Phường Xã',
            placeholder: 'Chọn Phường Xã',
            options: [],
            value: defaultSelectValue,
            isLoading: isWardLoading,
            name: 'ward_id',
            control: control,

        },
    ], [defaultSelectValue, setProvinceId, setDistrictId, control])

    const { selectBox, updateSelectBoxValue, updateSelectBoxOptions } = useSelectBox(initialSelectBoxs)

    useEffect(() => {

        if (provinces.data && provinces.data.length) {
            updateSelectBoxOptions('province_id', provinces.data)
            if (dataPatient) {
                updateSelectBoxValue('province_id', provinces.data, String(dataPatient?.province_id))
            }
        }

    }, [provinces.data, dataPatient, updateSelectBoxValue, updateSelectBoxOptions])

    useEffect(() => {

        if (districts.data && districts.data.length) {
            updateSelectBoxOptions('district_id', districts.data)
            if (dataPatient) {
                updateSelectBoxValue('district_id', districts.data, String(dataPatient?.district_id))
            }
        }

    }, [districts.data, dataPatient, updateSelectBoxValue, updateSelectBoxOptions])

    useEffect(() => {
        if (wards.data && wards.data.length) {
            updateSelectBoxOptions('ward_id', wards.data)
            if (dataPatient) {
                updateSelectBoxValue('ward_id', wards.data, String(dataPatient?.district_id))
            }
        }
    }, [wards.data, dataPatient, updateSelectBoxValue, updateSelectBoxOptions])

    useEffect(() => {
        if (isSuccess === true && data && data.booking) {
            if (data.payUrl) {
                window.location.href = data.payUrl;
            } else {
                const paramIdBooking = data.booking.id
                navigate(`${redirectIfSucces}/${paramIdBooking}`)
            }
        }

    }, [isSuccess, data])
    return (
        <>
            <div>
                <InforScheduleBooking
                    dataDoctor={dataDoctor}
                    selectedDataSchedule={selectedDataSchedule}
                    schedule={schedule}
                />
                <div>
                    <div className="uppercase text-center mt-[10px] text-[16px] font-semibold">
                        {
                            !patientRedux || patientRedux == null ? (
                                'Đặt lịch khám ngay'
                            ) : (
                                <>
                                    Đặt lịch khám nào <span className="text-red-500">{patientRedux.name}</span> ơi!
                                </>
                            )
                        }
                    </div>
                    <FormProvider {...methods}>
                        <form
                            onSubmit={handleSubmit(onSubmitHanler)}
                        >
                            <div className="grid gap-4 py-4">
                                {validationRules && validationRules.map((item, index) => (
                                    <CustomInput
                                        key={index}
                                        {...item}
                                    />
                                ))}

                                {selectBox && selectBox.map((item, index) => (
                                    <CustomSelectBox
                                        key={index}
                                        {...item}
                                        register={register}
                                        errors={errors}
                                    />
                                ))}
                                <CustomInput
                                    label="Địa chỉ hiện tại:"
                                    name="address"
                                    type="text"
                                />
                                <CustomInput
                                    label="Lý do khám bệnh:"
                                    name="note"
                                    type="text"
                                />
                                <CustomRadioGroup
                                    control={control}
                                    defaultValue="cod"
                                    name="method"
                                    errors={errors}
                                />
                                <TotalPriceBooking
                                    selectedDataSchedule={selectedDataSchedule}
                                    control={control}
                                    namePriceSchedule="price_schedule"
                                    nameTotalPrice="total_price"
                                />
                            </div>
                            <div className="text-right mt-[20px]">
                                <LoadingButton
                                    loading={loading}
                                    text="Xác nhận đặt khám"
                                />
                            </div>
                            <CustomInput
                                name="doctor_id"
                                type="hidden"
                                value={dataDoctor.id}
                            />
                            <CustomInput
                                name="schedule_id"
                                type="hidden"
                                value={selectedDataSchedule.id}
                            />
                        </form>
                    </FormProvider>
                </div>
            </div>
        </>
    )
}

export default StoreBookingPatient