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
import Information from "@/components/Information";
import Seo from "@/components/Seo";
import Specialty from "@/components/Specialty";
import CustomDialog from "@/components/CustomDialog";
//SETTINGS
import { getDropdown } from "@/helper/myHelper";
import { breadcrumb, model, redirectIfSucces } from "@/modules/Hospital/settings/HospitalSettings";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
//INTERFACES
import { HospitalPayloadInput, Specialty as SpecialtyType } from "@/interfaces/types/HospitalType";
//HOOK
import useFormSubmit from "@/hook/useFormSubmit";
import { FormProvider, useForm } from "react-hook-form";
//SERVICE
import { getHospitalById, pagination, save } from "@/service/HospitalService";
//SCSS
import '@/assets/scss/Editor.scss';
import { spec } from "node:test/reporters";

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
    name: yup.string().required('Bạn chưa nhập vào tên nhóm bài viết'),
    canonical: yup.string().required('Bạn chưa nhập vào đường dẫn'),
    description: yup.string().optional(),
    content: yup.string().optional(),
    address: yup.string().required('Bạn chưa nhập vào địa chỉ'),
    publish: yup.string().optional(),
    follow: yup.string().optional(),
    specialties: yup.array().of(
        yup.object().shape({
            value: yup.string().required('Bạn chưa nhập vào id'),
            label: yup.string().required('Bạn chưa nhập vào tên chuyên khoa')
        })
    ).min(1, 'Bạn chưa chọn chuyên khoa').required('Bạn chưa chọn chuyên khoa'),
    image: fileValidation(['image/jpeg', 'image/png', 'image/gif', 'image/jpg'], 2).optional().nullable(),
    icon: fileValidation(['image/jpeg', 'image/png', 'image/gif', 'image/jpg'], 2).optional().nullable(),
})

/*
    Memo: Tối ưu số lần re render không cần thiết của component con khi prop của component con này thay đổi
    useCallback: Tối ưu số lần re render không cần thiết của component con khi mà component con gọi vào 1 hàm của component cha
    useMemo: Dùng để lưu lại, ghi nhớ lại 1 phép tính toán (kết quả)
*/

const Store = ({

}) => {

    const [album, setAlbum] = useState<string[]>([])

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

    //------------------------------------------------
    const methods = useForm<HospitalPayloadInput>({
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
    const { data: dropdown, isLoading: isDropdownLoading, isError: isDropDownError } = useQuery([model], () => pagination(''))
    const { data: hospital, isLoading, isError } = useQuery([model, id], () => getHospitalById(id), {
        enabled: !!id,
        onSuccess: (data) => {
            reset({
                ...data,
                name: data.name,
                description: data.description,
                content: data.content,
                meta_title: data.meta_title,
                meta_keyword: data.meta_keyword,
                meta_description: data.meta_description,
                canonical: data.canonical,
                address: data.address,
                publish: String(data.publish),
                follow: String(data.follow),
                image: data.image,
                icon: data.icon,
            })
        }
    })

    //Dropdown Select Parent
    const hospitals = useMemo(() => {
        if (!isDropdownLoading && dropdown) {
            return dropdown[model] ? getDropdown(dropdown[model]) : []
        }
        return []
    }, [dropdown])



    useEffect(() => {
        isSuccess === true && navigate(redirectIfSucces)
    }, [isSuccess])


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
                                        label="Tên bệnh viện"
                                    />
                                    {/* Cứ khi nào thằng con thông qua props làm thay đổi thằng cha thì là callback */}
                                    <Album
                                        onAlbumChange={handleAlbum}
                                        data={hospital}
                                    />
                                    {/* -------------SEO------------------- */}
                                    {id ? hospital && <Seo data={hospital} /> : <Seo />}
                                </div>
                                <div className="col-span-3">
                                    <Information
                                        label="Địa chỉ"
                                        name="address"
                                    />
                                    {id ? hospital && <ImageIcon data={hospital} /> : <ImageIcon />}
                                    <Specialty
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
        </>
    )
}

export default Store