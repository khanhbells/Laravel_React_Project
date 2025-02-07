//CORE REACT
import { useCallback, useEffect, useState, useMemo, useRef } from "react";
import { useQueries, useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";
//COMPONENT
import PageHeading from "@/components/heading"
import LoadingButton from "@/components/LoadingButton"
import General from "@/components/General";
import Album from "@/components/Album";
import Seo from "@/components/Seo";
import ImageIcon from "@/components/ImageIcon";
import Advance from "@/components/Advance";
import Parent from "@/components/Parent";
//SETTINGS
import { breadcrumb, model, redirectIfSucces } from "@/modules/MedicineCatalogue/settings"
import { Breadcrumb } from "@/types/Breadcrumb"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
import { formatCatalogueName, getDropdown } from "@/helper/myHelper";
//INTERFACES
import { MedicineCataloguePayloadInput } from "@/interfaces/types/MedicineCatalogueType";
//HOOK
import { useForm, FormProvider } from "react-hook-form";
import useFormSubmit from "@/hook/useFormSubmit";
//SERVICE
import { save, getMedicineCatalogueById } from "@/service/MedicineCatalogueService";
import { pagination } from "@/service/MedicineCatalogueService";
//SCSS
import '@/assets/scss/Editor.scss'
import { error } from "console";

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
    name: yup.string().required('Bạn chưa nhập vào tên loại thuốc'),
    canonical: yup.string().required('Bạn chưa nhập vào đường dẫn'),
    description: yup.string().optional(),
    content: yup.string().optional(),
    parent_id: yup.string().optional(),
    publish: yup.string().optional(),
    follow: yup.string().optional(),
    image: fileValidation(['image/jpeg', 'image/png', 'image/gif', 'image/jpg'], 2).optional().nullable(),
    icon: fileValidation(['image/jpeg', 'image/png', 'image/gif', 'image/jpg'], 2).optional().nullable()
})

/*
    Memo: Tối ưu số lần re render không cần thiết của component con khi prop của component con này thay đổi
    useCallback: Tối ưu số lần re render không cần thiết của component con khi mà component con gọi vào 1 hàm của component cha
    useMemo: Dùng để lưu lại, ghi nhớ lại 1 phép tính toán (kết quả)
*/

const Store = ({

}) => {
    //Kiem tra re render
    // const countStoreComponentRender = useRef(1);

    // useEffect(() => {
    //     countStoreComponentRender.current += 1
    // })

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
    const methods = useForm<MedicineCataloguePayloadInput>({
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
    const { data: medicineCatalogue, isLoading, isError } = useQuery([model, id], () => getMedicineCatalogueById(id), {
        enabled: !!id,
        onSuccess: (data) => {
            reset({
                name: data.name,
                description: data.description,
                content: data.content,
                meta_title: data.meta_title,
                meta_keyword: data.meta_keyword,
                meta_description: data.meta_description,
                canonical: data.canonical,
                parent_id: data.parent_id,
                publish: String(data.publish),
                follow: String(data.follow),
                image: data.image,
                icon: data.icon
            })
        }
    })

    //Dropdown Select Parent
    const medicineCatalogues = useMemo(() => {
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
                                        label="Tên loại thuốc"
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
                                            name="parent_id"
                                            options={medicineCatalogues}
                                        />
                                    }
                                    {id ? medicineCatalogue && <ImageIcon data={medicineCatalogue} /> : <ImageIcon />}
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