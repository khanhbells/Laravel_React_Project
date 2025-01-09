//CORE REACT
import { useQuery } from "react-query";
//COMPONENT
import CustomInput from "@/components/CustomInput"
import LoadingButton from "@/components/LoadingButton"
//HOOK
import { FormProvider, useForm } from "react-hook-form";
import useFormSubmit from "@/hook/useFormSubmit";
import useSetFormValue from "@/hook/useSetFormValue";
//SETTING
import { TTagPayloadInput, TTag } from "@/interfaces/types/TagType";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
//SERVICE
import { save, getTagById, ITag } from "@/service/TagService";
//INTERFACES
import { UserCatalogueStoreProps } from "@/interfaces/UserCatalogueInterface";



const Store = ({ id, action, refetch, closeSheet }: UserCatalogueStoreProps) => {
    const schema = yup.object().shape({
        name: yup.string().required('Bạn chưa nhập vào tên tag').min(3, 'Tên tag tối thiểu phải có 3 ký tự'),
        canonical: yup.string().required('Bạn chưa nhập vào đường dẫn')
    })

    //useForm
    const methods = useForm<TTagPayloadInput>({
        context: { action },
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    });
    const { register, handleSubmit, reset, formState: { errors }, setValue, control } = methods
    const { onSubmitHanler, loading } = useFormSubmit(save, { action: action, id: id }, null, 'tags', closeSheet)

    const { data, isLoading, isError } = useQuery<ITag>(['tags', id],
        () => getTagById(id),
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
                        label="Tên tag"
                        name="name"
                        type="text"
                        value={data && data.name}
                    />
                    <CustomInput
                        label="Đường dẫn"
                        name="canonical"
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

export default Store