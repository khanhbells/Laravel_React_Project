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
//SETTINGS
import { getDropdown } from "@/helper/myHelper";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { breadcrumb, model, redirectIfSucces } from "../settings";
import { queryKey } from "@/constant/query";
//INTERFACES
import { MedicinePayloadInput } from "@/interfaces/types/MedicineType";
//HOOK
import useFormSubmit from "@/hook/useFormSubmit";
import { FormProvider, useForm } from "react-hook-form";
//SERVICE
import { pagination } from "@/service/MedicineCatalogueService";
import { findById, save } from "@/service/MedicineService";
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
    name: yup.string().required('Bạn chưa nhập vào tên nhóm thuốc'),
    canonical: yup.string().required('Bạn chưa nhập vào đường dẫn'),
    description: yup.string().optional(),
    content: yup.string().optional(),
    parent_id: yup.string().optional(),
    publish: yup.string().optional(),
    follow: yup.string().optional(),
    image: fileValidation(['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/webp'], 2).optional().nullable(),
    icon: fileValidation(['image/jpeg', 'image/png', 'image/gif', 'image/jpg', 'image/webp'], 2).optional().nullable()
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
    const methods = useForm<MedicinePayloadInput>({
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
    const { data: dropdown, isLoading: isDropdownLoading, isError: isDropDownError } = useQuery([queryKey.medicineCatalogues], () => pagination(''))
    const { data: medicineCatalogue, isLoading, isError } = useQuery([model, id], () => findById(id), {
        enabled: !!id,
        onSuccess: (data) => {
            reset({
                ...data,
                publish: String(data.publish),
                follow: String(data.follow),
                catalogues: String(data.catalogues),
            })
        },
        staleTime: 3000
    })

    //Dropdown Select Parent
    const medicineCatalogues = useMemo(() => {
        if (!isDropdownLoading && dropdown) {
            return dropdown['medicine_catalogues'] ? getDropdown(dropdown['medicine_catalogues']) : []
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
                                        label="Tên thuốc"
                                    />
                                    {/* Cứ khi nào thằng con thông qua props làm thay đổi thằng cha thì là callback */}
                                    <Album
                                        onAlbumChange={handleAlbum}
                                        data={medicineCatalogue}
                                    />
                                    {/* -------------SEO------------------- */}
                                    {id ? medicineCatalogue && <Seo data={medicineCatalogue} /> : <Seo />}
                                </div>
                                <div className="col-span-3">

                                    {dropdown &&
                                        < Parent
                                            name="medicine_catalogue_id"
                                            options={medicineCatalogues}
                                            showMultiple={true}
                                            showMultipleName="catalogues"
                                        />
                                    }
                                    {id ? medicineCatalogue && <ImageIcon data={medicineCatalogue} /> : <ImageIcon />}
                                    <Tag
                                        onOpenDialog={handleOpenDialog}
                                        newTags={newTags}
                                        setNewTags={setNewTag}
                                    />
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