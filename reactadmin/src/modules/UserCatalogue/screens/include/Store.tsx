//CORE REACT
import { useEffect } from "react";
import { useQuery } from "react-query";
//COMPONENT
import CustomInput from "@/components/CustomInput"
import LoadingButton from "@/components/LoadingButton"
//HOOK
import { FormProvider, useForm } from "react-hook-form";
import useFormSubmit from "@/hook/useFormSubmit";
import useSetFormValue from "@/hook/useSetFormValue";
//SETTING
import { UserCatalogue } from "@/interfaces/types/UserCatalogueType";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
//SERVICE
import { save, getUserCatalogueById } from "@/service/UserCatalogueService";
//INTERFACES
import { UserCatalogueStoreProps } from "@/interfaces/UserCatalogueInterface";
import { UserCataloguePayloadInput } from "@/interfaces/types/UserCatalogueType";



const UserCatalogueStore = ({ id, action, refetch, closeSheet }: UserCatalogueStoreProps) => {
    const schema = yup.object().shape({
        name: yup.string().required('Bạn chưa nhập vào tên nhóm thành viên').min(3, 'Tên nhóm thành viên tối thiểu phải có 3 ký tự'),
        description: yup.string().optional(),
    })

    //useForm
    const methods = useForm<UserCataloguePayloadInput>({
        context: { action },
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    });
    const { register, handleSubmit, reset, formState: { errors }, setValue, control } = methods
    const { onSubmitHanler, loading } = useFormSubmit(save, { action: action, id: id }, null, refetch, closeSheet)

    const { data, isLoading, isError } = useQuery<UserCatalogue>(['user_catalogue', id],
        () => getUserCatalogueById(id),
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
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitHanler)}>
                <div className="grid gap-4 py-4">
                    <CustomInput
                        label="Tên nhóm"
                        name="name"
                        type="text"
                        value={data && data.name}
                    />
                    <CustomInput
                        label="Mô tả"
                        name="description"
                        type="text"
                        value={data && data.description}
                    />
                </div>
                <div className="text-right">
                    <LoadingButton
                        loading={loading}
                        text="Lưu thông tin"
                    />
                </div>
            </form>
        </FormProvider>
    )
}

export default UserCatalogueStore