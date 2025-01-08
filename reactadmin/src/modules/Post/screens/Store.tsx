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
import Tag from "@/components/Tag";
//SETTINGS
import { getDropdown } from "@/helper/myHelper";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { breadcrumb, model, redirectIfSucces } from "../settings";
import { queryKey } from "@/constant/query";
//INTERFACES
import { PostPayloadInput } from "@/interfaces/types/PostType";
//HOOK
import useFormSubmit from "@/hook/useFormSubmit";
import { FormProvider, useForm } from "react-hook-form";
//SERVICE
import { pagination } from "@/service/PostCatalogueService";
import { pagination as tagPagination } from "@/service/TagService";
import { findById, save } from "@/service/PostService";
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
    name: yup.string().required('Bạn chưa nhập vào tên nhóm bài viết'),
    canonical: yup.string().required('Bạn chưa nhập vào đường dẫn'),
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
    const methods = useForm<PostPayloadInput>({
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
    const { data: dropdown, isLoading: isDropdownLoading, isError: isDropDownError } = useQuery([queryKey.postCatalogues], () => pagination(''))
    const { data: tags, isLoading: isTagLoading, isError: isTagError } = useQuery([queryKey.tags], () => pagination(''))
    const { data: postCatalogue, isLoading, isError } = useQuery([model, id], () => findById(id), {
        enabled: !!id,
        onSuccess: (data) => {
            reset({
                ...data,
                publish: String(data.publish),
                follow: String(data.follow),
                catalogues: String(data.catalogues)
            })
        },
        // staleTime: 6000
    })

    //Dropdown Select Parent
    const postCatalogues = useMemo(() => {
        if (!isDropdownLoading && dropdown) {
            return dropdown['post_catalogues'] ? getDropdown(dropdown['post_catalogues']) : []
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
                                    <General />
                                    {/* Cứ khi nào thằng con thông qua props làm thay đổi thằng cha thì là callback */}
                                    <Album
                                        onAlbumChange={handleAlbum}
                                        data={postCatalogue}
                                    />
                                    {/* -------------SEO------------------- */}

                                    {id ? postCatalogue && <Seo data={postCatalogue} /> : <Seo />}
                                </div>
                                <div className="col-span-3">

                                    {dropdown &&
                                        < Parent
                                            name="post_catalogue_id"
                                            options={postCatalogues}
                                            showMultiple={true}
                                            showMultipleName="catalogues"
                                        />
                                    }
                                    {id ? postCatalogue && <ImageIcon data={postCatalogue} /> : <ImageIcon />}
                                    <Tag />
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