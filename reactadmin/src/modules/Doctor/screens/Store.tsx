//CORE REACT
import { useCallback, useEffect, useMemo, useState } from "react";
import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
//COMPONENT
import Advance from "@/components/Advance";
import Album from "@/components/Album";
import General from "@/components/General";
import PageHeading from "@/components/heading";
import ImageIcon from "@/components/ImageIcon";
import LoadingButton from "@/components/LoadingButton";
import Parent from "@/components/Parent";
import Seo from "@/components/Seo";
import CustomDialog from "@/components/CustomDialog"
import Tag from "@/components/Tag";
import CreateTag from "@/components/CreateTag";
import Information from "@/components/Information";
import Specialty from "@/components/Specialty";
//SETTINGS
import { getDropdown } from "@/helper/myHelper";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { breadcrumb, model, redirectIfSucces } from "../settings";
import { queryKey } from "@/constant/query";
//INTERFACES
import { DoctorPayloadInput } from "@/interfaces/types/DoctorType";
//HOOK
import useFormSubmit from "@/hook/useFormSubmit";
import { FormProvider, useForm } from "react-hook-form";
//SERVICE
import { findById, save } from "@/service/DoctorService";
import { pagination } from "@/service/HospitalService";
//SCSS
import '@/assets/scss/Editor.scss';

const fileValidation = (fileTypes: string[], maxFileSize: number) => {
    return yup.mixed().test('fileType', 'Loại tệp không hợp kệ', (value: any) => {
        const file = value && value[0]
        if (!file || !(file instanceof File)) {
            return true
        }
        if (!fileTypes.includes(file.type)) {
            return false
        }
        return true
    })
}

const schema = yup.object().shape({
    name: yup.string().required('Bạn chưa nhập vào tên bác sĩ'),
    canonical: yup.string().required('Bạn chưa nhập vào đường dẫn'),
    user_id: yup.string().required('Người dùng không tồn tại'),
    description: yup.string().optional(),
    content: yup.string().optional(),
    parent_id: yup.string().optional(),
    publish: yup.string().optional(),
    follow: yup.string().optional(),
    image: fileValidation(['image/jpeg', 'image/png', 'image/gif', 'image/jpg'], 2).optional().nullable(),
    icon: fileValidation(['image/jpeg', 'image/png', 'image/gif', 'image/jpg'], 2).optional().nullable()
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
    const methods = useForm<DoctorPayloadInput>({
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    })
    const { handleSubmit, reset, formState: { errors } } = methods

    //Gui du lieu ve phia server
    const { onSubmitHanler, loading, isSuccess } = useFormSubmit(save, { action: currentAction, id: id }, album)
    const handleAlbum = useCallback(
        (images: string[]) => {
            setAlbum(images)
        }, []
    )

    //useQuery
    const { data: dropdown, isLoading: isDropdownLoading, isError: isDropDownError } = useQuery([queryKey.hospitals], () => pagination(''), {
        staleTime: 6000
    })
    const { data: doctor, isLoading, isError } = useQuery([model, id], () => findById(id), {
        enabled: !!id,
        onSuccess: (data) => {
            reset({
                ...data,
                publish: data.publish != '' ? String(data.publish) : '1',
                follow: data.follow != '' ? String(data.follow) : '1',
                user_id: data.user_id,
            })
        },
        staleTime: 6000, // Dữ liệu không bao giờ bị coi là stale
    })

    //Dropdown Select Parent
    const hospitals = useMemo(() => {
        if (!isDropdownLoading && dropdown) {
            return dropdown['hospitals'] ? getDropdown(dropdown['hospitals']) : []
        }
        return []
    }, [dropdown])


    //Tra ve view
    useEffect(() => {
        isSuccess === true && navigate(redirectIfSucces)
    }, [isSuccess])

    //Tag dialog create
    const handleOpenDialog = useCallback(() => {
        setOpenDialog(true)
    }, [])
    const handleNewTag = useCallback((tag: { value: string, label: string }) => {
        setNewTag(prev => [...prev, tag])
    }, [])

    const InformationText = [
        {
            label: "Bằng cấp",
            name: "exp"
        },
        {
            label: "Tên phòng khám",
            name: "clinic_name"
        },
        {
            label: "Địa chỉ phòng khám",
            name: "clinic_address"
        },
    ]


    return (
        <>
            <FormProvider {...methods}>
                <div className="page-container " >
                    <PageHeading breadcrumb={breadcrumbData} />
                    <div className="p-[15px]">
                        <form onSubmit={handleSubmit(onSubmitHanler)}>
                            <div className="grid grid-cols-12 gap-4 ">
                                <div className="col-span-9">
                                    <General
                                        label="Tên bác sĩ"
                                    />
                                    {/* Cứ khi nào thằng con thông qua props làm thay đổi thằng cha thì là callback */}
                                    <Album
                                        onAlbumChange={handleAlbum}
                                        data={doctor}
                                    />
                                    {/* -------------SEO------------------- */}
                                    {id ? doctor && <Seo data={doctor} /> : <Seo />}
                                </div>
                                <div className="col-span-3">
                                    {dropdown &&
                                        < Parent
                                            label="Bệnh viện"
                                            name="hospital_id"
                                            options={hospitals}
                                            showMultiple={true}
                                        />
                                    }
                                    <Specialty />
                                    {id ? doctor && <ImageIcon flag={false} data={doctor} /> : <ImageIcon flag={false} />}
                                    <Tag
                                        onOpenDialog={handleOpenDialog}
                                        newTags={newTags}
                                        setNewTags={setNewTag}
                                    />
                                    {
                                        InformationText.map((item, index) => (
                                            <Information
                                                key={index}
                                                label={item.label}
                                                name={item.name}
                                            />
                                        ))
                                    }
                                    <Advance />
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
                    heading="Thêm tag mới"
                    description="Nhập đầy đủ thông tin dưới đây. Các mục có dấu (*) là bắt buộc"
                    buttonLoading={false}
                    open={openDialog}
                    close={() => setOpenDialog(false)}
                >
                    <CreateTag
                        close={() => setOpenDialog(false)}
                        onNewTag={handleNewTag}
                    />
                </CustomDialog>
            )}
        </>
    )
}
export default Store