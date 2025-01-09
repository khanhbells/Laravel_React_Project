//REACT
import { useState, memo, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
//COMPONENT
import CustomInput from "./CustomInput";
import LoadingButton from "./LoadingButton";
//SETTINGS
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
//HOOK
import useFormSubmit from "@/hook/useFormSubmit";
//API
import { save } from "@/service/TagService";
export type TTag = {
    name: string,
    canonical: string
}

export interface ICreateTag {
    close: () => void,
    onNewTag: (tag: { value: string, label: string }) => void
}

const schema = yup.object().shape({
    name: yup.string().required('Bạn chưa nhập vào tên tag'),
    canonical: yup.string().required('Bạn chưa nhập vào đường dẫn'),
})
const CreateTag = ({
    close,
    onNewTag
}: ICreateTag) => {
    //-------------------------------------
    const methods = useForm<TTag>({
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    })
    const { handleSubmit, reset, formState: { errors } } = methods
    const { onSubmitHanler, loading, isSuccess, data } = useFormSubmit(save, { action: '', id: '' })

    useEffect(() => {
        if (isSuccess && data && data.tag) {
            onNewTag({
                value: String(data.tag.id),
                label: String(data.tag.name)
            })
            close()
        } else {

        }
    }, [isSuccess, data])

    return (
        <>
            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmitHanler)}>
                    <div className="grid gap-[10px] py-4">
                        <CustomInput
                            label="Tiêu đề tag"
                            name="name"
                            type="text"
                            value=""
                            className="gap-4"
                            labelClassName="mb-[10px] block"
                            required={true}
                        />
                        <CustomInput
                            label="Đường dẫn"
                            name="canonical"
                            type="text"
                            value=""
                            className="gap-4"
                            labelClassName="mb-[10px] block"
                            required={true}
                        />
                        <LoadingButton
                            loading={loading}
                            text="Thực hiện"
                        />
                    </div>
                </form>
            </FormProvider>
        </>
    )
}

export default memo(CreateTag)