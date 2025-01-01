//CORE REACT
import { useEffect } from "react";
import { useQuery } from "react-query";
//COMPONENT
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
//HOOK
import { useForm } from "react-hook-form";
import useFormSubmit from "@/hook/useFormSubmit";
import useSetFormValue from "@/hook/useSetFormValue";
//SETTING
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
//SERVICE
import { save, getPostCatalogueById } from "@/service/PostCatalogueService";
//INTERFACES
import { PostCatalogueStoreProps } from "@/interfaces/PostCatalogueInterface";
import { PostCatalogue, PostCataloguePayloadInput } from "@/interfaces/types/PostCatalogueType";




const PostCatalogueStore = ({ id, action, refetch, closeSheet }: PostCatalogueStoreProps) => {
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
        <form onSubmit={handleSubmit(onSubmitHanler)}>
            <div className="grid grid-cols-12 gap-4 mt-[15px]">
                <div className="col-span-9">
                    <Card className="rounded-[5px] mt-[15px]">
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
                            />
                        </CardContent>
                    </Card>
                </div>
                <div className="col-span-3">
                    456
                </div>
            </div>

            <div className="text-right">
                <LoadingButton
                    loading={loading}
                    text="Lưu thông tin"
                />
            </div>
        </form>
    )
}

export default PostCatalogueStore