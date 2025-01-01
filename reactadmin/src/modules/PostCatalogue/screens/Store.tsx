//CORE REACT
import { useEffect, useState } from "react";
import { useQuery } from "react-query";
//COMPONENT
import PageHeading from "@/components/heading"
import CustomInput from "@/components/CustomInput"
import LoadingButton from "@/components/LoadingButton"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import CustomCKEditor from "@/components/CustomCKEditor";
import CustomTextarea from "@/components/Customtextarea";
//SETTINGS
import { breadcrumb, tableColumn, buttonActions } from "@/modules/PostCatalogue/settings/PostCatalogueSettings"
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
const Store = ({ id, action, refetch, closeSheet }: PostCatalogueStoreProps) => {
    const breadcrumbData: Breadcrumb = breadcrumb.create
    const schema = yup.object().shape({
        name: yup.string().required('Bạn chưa nhập vào tên nhóm thành viên').min(3, 'Tên nhóm thành viên tối thiểu phải có 3 ký tự'),
        description: yup.string().optional(),
    })

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        control,
        setValue
    } = useForm<PostCataloguePayloadInput>({
        context: { action },
        resolver: yupResolver(schema)
    })
    const { onSubmitHanler, loading } = useFormSubmit(save, refetch, closeSheet, { action: action, id: id })

    const { data, isLoading, isError } = useQuery<PostCatalogue>(['post_catalogue', id],
        () => getPostCatalogueById(id),
        {
            enabled: action === 'update' && !!id,
        }
    )

    //follow data seen update
    //Set value cho input update để gửi dữ liệu
    useSetFormValue({
        isLoading,
        data,
        action,
        setValue
    })
    return (
        <>
            <div className="page-container " >
                <PageHeading breadcrumb={breadcrumbData} />
                <div className="p-[15px]">
                    <form onSubmit={handleSubmit(onSubmitHanler)}>
                        <div className="grid grid-cols-12 gap-4 ">
                            <div className="col-span-9">
                                <Card className="rounded-[5px] mb-[20px]">
                                    <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                                        <CardTitle className="uppercase">Thông tin chung</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-[15px]">
                                        <CustomInput
                                            register={register}
                                            errors={errors}
                                            label="Tiêu đề nhóm bài viết"
                                            name="name"
                                            type="text"
                                            value={data && data.name}
                                            className="gap-4"
                                            labelClassName="mb-[10px] block"
                                            required={true}
                                        />
                                        <CustomCKEditor
                                            label="Mô tả ngắn"
                                            className="ckeditor-description mb-[20px]"
                                        />
                                        <CustomCKEditor
                                            label="Nội dung"
                                            className="ckeditor-content"
                                        />
                                    </CardContent>
                                </Card>
                                <Card className="rounded-[5px] mt-[15px]">
                                    <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                                        <CardTitle className="uppercase">Thông tin chung</CardTitle>
                                    </CardHeader>
                                    <CardContent className="pt-[15px]">
                                        <CardTitle className="uppercase">Cấu hình SEO</CardTitle>
                                        <div className="seo-preview mb-[40px]">
                                            <div className="text-[20px] text-[#1a0dab] mb-[5px]">Bạn chưa nhập vào tiêu đề SEO</div>
                                            <div className="text-[14px] text-[green] mb-[5px]">http://nhap-vao-duong-dan-cua-ban.html</div>
                                            <div className="text-[14px] text-[#33]">Bạn chưa nhập vào tiêu đề SEO </div>
                                        </div>
                                        <CustomInput
                                            register={register}
                                            errors={errors}
                                            label="Tiêu đề SEO"
                                            name="meta_title"
                                            type="text"
                                            value=""
                                            className="gap-4"
                                            labelClassName="mb-[10px] block"
                                            required={true}
                                        />
                                        <CustomInput
                                            register={register}
                                            errors={errors}
                                            label="Từ khóa SEO"
                                            name="meta_title"
                                            type="text"
                                            value=""
                                            className="gap-4"
                                            labelClassName="mt-[15px] mb-[10px] block"
                                            required={true}
                                        />
                                        <CustomTextarea
                                            register={register}
                                            errors={errors}
                                            label="Mô tả SEO"
                                            name="meta_description"
                                            type="text"
                                            value=""
                                            className="gap-4"
                                            labelClassName="mt-[15px] mb-[10px] block"
                                            required={true}
                                            inputClassName="min-h-[100px]"
                                        />
                                    </CardContent>
                                </Card>
                            </div>
                            <div className="col-span-3">
                                456
                            </div>
                        </div>

                        {/* <div className="text-right">
                            <LoadingButton
                                loading={loading}
                                text="Lưu thông tin"
                            />
                        </div> */}
                    </form>
                </div>
            </div>
        </>
    )

}

export default Store