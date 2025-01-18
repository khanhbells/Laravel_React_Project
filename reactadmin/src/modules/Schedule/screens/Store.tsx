//CORE REACT
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
//COMPONENT
import PageHeading from "@/components/heading";
import LoadingButton from "@/components/LoadingButton";
import CustomDatePicker from "@/components/CustomDatePicker";
import Parent from "@/components/Parent";
import TimeSlot from "@/components/TimeSlot";
import DetailTimeSlot from "@/components/DetailTimeSlot";
import CustomDialog from "@/components/CustomDialog";
import CreateTimeSlot from "./include/CreateTimeSlot";
//SETTINGS
import { queryKey } from "@/constant/query";
import { getDropdown } from "@/helper/myHelper";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { breadcrumb, model, redirectIfSucces } from "../settings";
//INTERFACES
import { SchedulePayloadInput } from "@/interfaces/types/ScheduleType";
//HOOK
import useFormSubmit from "@/hook/useFormSubmit";
import { FormProvider, useForm } from "react-hook-form";
//SERVICE
import { findById, save } from "@/service/ScheduleService";
import { pagination } from "@/service/DoctorService";
import { getUserById } from "@/service/UserService";
import { pagination as paginationTimeSlot } from "@/service/TimeSlotService";
//SCSS
import '@/assets/scss/Editor.scss';
//CONTEXT
import { TimeSlotProvider } from "@/contexts/TimeSlotContext";
import { useUserContext } from "@/contexts/UserContext";



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
})

const Store = ({

}) => {
    //--------------STATE--------------------
    const [openDialog, setOpenDialog] = useState<boolean>()
    const [loadingTimeSlot, setLoadingTimeSlot] = useState<boolean>(false)

    //--------------CONTEXT------------------
    const { user } = useUserContext();


    //--------------------------------------
    const navigate = useNavigate()
    const { id } = useParams()
    const currentAction = useMemo(() => id ? 'update' : '', [])
    const breadcrumbData = useMemo(() => {
        const actionData = currentAction === 'update' ? breadcrumb.update : breadcrumb.create;
        // Gán id vào route nếu currentAction là 'update'
        const route = actionData.route.replace(':id', id || '');
        return { ...actionData, route }; // Trả về dữ liệu breadcrumb với route đã được thay thế
    }, [currentAction, id, breadcrumb]);

    //-------------------FormSubmit------------------
    const methods = useForm<SchedulePayloadInput>({
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    })
    const { handleSubmit, reset, formState: { errors } } = methods

    //Gui du lieu ve phia server
    const { onSubmitHanler, loading, isSuccess } = useFormSubmit(save, { action: currentAction, id: id })

    //useQuery
    const { data: dropdown, isLoading: isDropdownLoading, isError: isDropDownError } = useQuery([queryKey.doctors], () => pagination(''))
    const { data: doctor, isLoading, isError } = useQuery(['users', user?.id], () => getUserById(String(user?.id)), {
        enabled: !!user?.id && user?.user_catalogue_id === 2,
        onSuccess: (data) => {
            reset({
                user_id: String(data.id)
            })
        },
        staleTime: 3000
    })

    //Dropdown Select Parent
    const doctors = useMemo(() => {
        if (!isDropdownLoading && dropdown) {
            console.log(dropdown['users']);
            return dropdown['users'] ? getDropdown(dropdown['users']) : []
        }
        console.log(doctor);
        return []
    }, [dropdown, user, doctor])


    //Tra ve view
    useEffect(() => {
        isSuccess === true && navigate(redirectIfSucces)
    }, [isSuccess])

    //Tag dialog create
    const handleOpenDialog = useCallback(() => {
        setOpenDialog(true)
    }, [])


    return (
        <>
            <FormProvider {...methods}>
                <div className="page-container " >
                    <PageHeading breadcrumb={breadcrumbData} />
                    <div className="p-[15px]">
                        <form onSubmit={handleSubmit(onSubmitHanler)}>
                            <div className="grid grid-cols-12 gap-4 ">
                                <div className="col-span-9">
                                    <TimeSlotProvider>
                                        <TimeSlot
                                            onOpenDialog={handleOpenDialog}
                                            loadingTimeSlot={loadingTimeSlot}
                                        />
                                        <DetailTimeSlot />
                                    </TimeSlotProvider>
                                </div>
                                <div className="col-span-3">
                                    {dropdown &&
                                        < Parent
                                            name="user_id"
                                            options={doctors}
                                            label="Bác sĩ"
                                        />
                                    }
                                    <CustomDatePicker
                                        name="date"
                                        label="Ngày khám bệnh"
                                    />
                                    <div className="mt-[20px] text-right">
                                        <LoadingButton
                                            loading={loading}
                                            text="Lưu thông tin"
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </FormProvider>
            {openDialog && (
                <CustomDialog
                    heading="Thêm thời gian mới"
                    description="Nhập đầy đủ thông tin dưới đây. Các mục có dấu (*) là bắt buộc"
                    buttonLoading={false}
                    open={openDialog}
                    close={() => setOpenDialog(false)}
                >
                    <CreateTimeSlot
                        close={() => setOpenDialog(false)}
                        setLoadingTimeSlot={setLoadingTimeSlot}
                    />
                </CustomDialog>
            )}
        </>
    )
}

export default Store