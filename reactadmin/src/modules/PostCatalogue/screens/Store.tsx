//CORE REACT
import { useCallback, useEffect, useState, useMemo } from "react";
import { useQueries } from "react-query";
import { useNavigate } from "react-router-dom";
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
import { breadcrumb, model, redirectIfSucces } from "@/modules/PostCatalogue/settings/PostCatalogueSettings"
import { Breadcrumb } from "@/types/Breadcrumb"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
import { formatCatalogueName, getDropdown } from "@/helper/myHelper";
//INTERFACES
import { PostCataloguePayloadInput } from "@/interfaces/types/PostCatalogueType";
//HOOK
import { useForm, FormProvider } from "react-hook-form";
import useFormSubmit from "@/hook/useFormSubmit";
//SERVICE
import { save } from "@/service/PostCatalogueService";
import { pagination } from "@/service/PostCatalogueService";
//SCSS
import '@/assets/scss/Editor.scss'

const Store = ({

}) => {
    const navigate = useNavigate()
    const [album, setAlbum] = useState<string[]>([])

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

    const breadcrumbData: Breadcrumb = breadcrumb.create
    const schema = yup.object().shape({
        name: yup.string().required('Bạn chưa nhập vào tên nhóm bài viết'),
        canonical: yup.string().required('Bạn chưa nhập vào đường dẫn'),
        description: yup.string().optional(),
        content: yup.string().optional(),
        parent_id: yup.string().optional(),
        publish: yup.number().optional(),
        follow: yup.number().optional(),
        image: fileValidation(['image/jpeg', 'image/png', 'image/gif', 'image/jpg'], 2).optional().nullable(),
        icon: fileValidation(['image/jpeg', 'image/png', 'image/gif', 'image/jpg'], 2).optional().nullable()
    })

    const methods = useForm<PostCataloguePayloadInput>({
        // context: { action },
        resolver: yupResolver(schema)
    })

    const { handleSubmit } = methods

    //Gui du lieu ve phia server
    const { onSubmitHanler, loading, isSuccess } = useFormSubmit(save, { action: '', id: null }, album)

    const handleAlbum = useCallback(
        (images: string[]) => {
            setAlbum(images)
        }, []
    )


    //Root catalogue

    const queries = useQueries([
        {
            queryKey: [model],
            queryFn: () => pagination('')
        }
    ]);


    const [dropdown] = queries


    // const { data, isLoading, isError } = useQuery<PostCatalogue>(['post_catalogue', id],
    //     () => getPostCatalogueById(id),
    //     {
    //         enabled: action === 'update' && !!id,
    //     }
    // )
    //follow data seen update
    //Set value cho input update để gửi dữ liệu
    // useSetFormValue({
    //     isLoading,
    //     data,
    //     action,
    //     setValue
    // })

    const postCatalogues = useMemo(() => {
        if (!dropdown.isLoading && dropdown.data) {
            return dropdown.data[model] ? getDropdown(dropdown.data[model]) : []
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
                                    <Album
                                        onAlbumChange={handleAlbum}
                                    />
                                    {/* -------------SEO------------------- */}
                                    <Seo />
                                </div>
                                <div className="col-span-3">
                                    <Parent
                                        name="parent_id"
                                        options={postCatalogues}
                                    />
                                    <ImageIcon
                                    />
                                    <Advance
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
        </>
    )
}

export default Store