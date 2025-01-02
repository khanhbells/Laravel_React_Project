//CORE REACT
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
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
import { breadcrumb } from "@/modules/PostCatalogue/settings/PostCatalogueSettings"
import { Breadcrumb } from "@/types/Breadcrumb"
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
//INTERFACES
import { PostCatalogueStoreProps } from "@/interfaces/PostCatalogueInterface";
import { PostCatalogue, PostCataloguePayloadInput } from "@/interfaces/types/PostCatalogueType";
//HOOK
import { useForm } from "react-hook-form";
import useFormSubmit from "@/hook/useFormSubmit";
import useSetFormValue from "@/hook/useSetFormValue";
//SERVICE
import { save, getPostCatalogueById } from "@/service/PostCatalogueService";
//SCSS
import '@/assets/scss/Editor.scss'

const Store = ({

}) => {
    const breadcrumbData: Breadcrumb = breadcrumb.create
    const schema = yup.object().shape({
        name: yup.string().required('Bạn chưa nhập vào tên nhóm bài viết'),
        canonical: yup.string().required('Bạn chưa nhập vào đường dẫn'),
        description: yup.string().optional(),
        content: yup.string().optional()
    })
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        control,
        setValue
    } = useForm<PostCataloguePayloadInput>({
        // context: { action },
        resolver: yupResolver(schema)
    })
    const { onSubmitHanler, loading } = useFormSubmit(save, { action: '', id: null })

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
    return (
        <>
            <div className="page-container " >
                <PageHeading breadcrumb={breadcrumbData} />
                <div className="p-[15px]">
                    <form onSubmit={handleSubmit(onSubmitHanler)}>
                        <div className="grid grid-cols-12 gap-4 ">
                            <div className="col-span-9">
                                <General
                                    register={register}
                                    errors={errors}
                                    control={control}
                                />
                                <Album />
                                {/* -------------SEO------------------- */}
                                <Seo
                                    register={register}
                                    errors={errors}
                                />
                            </div>
                            <div className="col-span-3">
                                <Parent />
                                <ImageIcon />
                                <Advance />
                                <div className="mt-[20px] text-right">
                                    <LoadingButton
                                        loading={false}
                                        text="Lưu thông tin"
                                    />
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )

}

export default Store