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
import StoreTimeSlot from "@/modules/TimeSlot/screens/include/Store";
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
import { pagination as paginationTimeSlot } from "@/service/TimeSlotService";
//SCSS
import '@/assets/scss/Editor.scss';
//CONTEXT
import { TimeSlotProvider } from "@/contexts/TimeSlotContext";
import { TableProvider } from "@/contexts/TableContext";



const schema = yup.object().shape({
    user_id: yup.string().optional(),
    doctor_id: yup.string().required("Bác sĩ là bắt buộc"),
    time_slots: yup.array().of(
        yup.object().shape({
            time_slot_id: yup.string().required("ID thời gian là bắt buộc"),
            price: yup.string().required("Giá tiền là bắt buộc").min(0, "Giá tiền không thể nhỏ hơn 0"),
        })
    ).required("Danh sách thời gian là bắt buộc"),
    date: yup.string().optional(),
    publish: yup.string().optional(),
})

const Store = ({

}) => {
    //--------------STATE--------------------
    const [album, setAlbum] = useState<string[]>([])
    const [openDialog, setOpenDialog] = useState<boolean>()
    const [newTags, setNewTag] = useState<{ value: string, label: string }[]>([])


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
    const { onSubmitHanler, loading, isSuccess } = useFormSubmit(save, { action: currentAction, id: id }, album)

    //useQuery
    const { data: dropdown, isLoading: isDropdownLoading, isError: isDropDownError } = useQuery([queryKey.doctors], () => pagination(''))
    const { data: scheduleCatalogue, isLoading, isError } = useQuery([model, id], () => findById(id), {
        enabled: !!id,
        onSuccess: (data) => {
            reset(data)
        },
        staleTime: 3000
    })

    //Dropdown Select Parent
    const doctors = useMemo(() => {
        if (!isDropdownLoading && dropdown) {
            return dropdown['users'] ? getDropdown(dropdown['users']) : []
        }
        return []
    }, [dropdown])


    //Tra ve view
    // useEffect(() => {
    //     isSuccess === true && navigate(redirectIfSucces)
    // }, [isSuccess])

    //Tag dialog create
    const handleOpenDialog = useCallback(() => {
        setOpenDialog(true)
    }, [])


    return (
        <>
            <TableProvider model="time_slots" pagination={paginationTimeSlot}>
                <TimeSlotProvider>
                    <FormProvider {...methods}>
                        <div className="page-container " >
                            <PageHeading breadcrumb={breadcrumbData} />
                            <div className="p-[15px]">
                                <form onSubmit={handleSubmit(onSubmitHanler)}>
                                    <div className="grid grid-cols-12 gap-4 ">
                                        <div className="col-span-9">
                                            <TimeSlot
                                                onOpenDialog={handleOpenDialog}
                                            />
                                            <DetailTimeSlot />
                                        </div>
                                        <div className="col-span-3">
                                            {dropdown &&
                                                < Parent
                                                    name="doctor_id"
                                                    options={doctors}
                                                    label="Bác sĩ"
                                                />
                                            }
                                            <CustomDatePicker />
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
                </TimeSlotProvider>
                {openDialog && (
                    <CustomDialog
                        heading="Thêm thời gian mới"
                        description="Nhập đầy đủ thông tin dưới đây. Các mục có dấu (*) là bắt buộc"
                        buttonLoading={false}
                        open={openDialog}
                        close={() => setOpenDialog(false)}
                    >
                        <StoreTimeSlot
                            close={() => setOpenDialog(false)}
                        />
                    </CustomDialog>
                )}
            </TableProvider>
        </>
    )
}

export default Store