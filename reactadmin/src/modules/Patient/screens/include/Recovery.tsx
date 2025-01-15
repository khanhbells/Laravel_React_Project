//REACT
import { useState } from "react";
//COMPONENT
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import LoadingButton from "@/components/LoadingButton"
import CustomInput from "@/components/CustomInput";
//HELPERS
import { showToast } from "@/helper/myHelper";
import { handleAxiosError } from "@/helper/axiosHelper";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
type Inputs = {
    password: string,
    confirmPassword: string
};

interface RecoveryProps {
    id: string,
    callback: Function
    [key: string]: any

}

const Recovery = ({
    id,
    callback,
    ...restProps
}: RecoveryProps) => {

    const schema = yup.object().shape({
        password: yup.string().required('Bạn chưa nhập vào ô mật khẩu').min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
        confirmPassword: yup.string().required('Bạn chưa nhập vào ô xác nhận mật khẩu').oneOf([yup.ref('password')], 'Mật khẩu nhập lại không chính xác'),
    })

    const [isLoading, setIsLoading] = useState<boolean>(false)



    const methods = useForm<Inputs>({
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    });
    const { register, handleSubmit, reset, formState: { errors }, setValue, control } = methods

    const changePasswordHanler: SubmitHandler<Inputs> = async (payload) => {

        setIsLoading(true)
        try {
            const res = await callback(id, payload)
            if (res.code === 200) {
                showToast(res.message, res.code === 200 ? 'success' : 'error')
                restProps.close()
            }
        } finally {
            setIsLoading(false)
        }

    };

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(changePasswordHanler)}>
                <div className="grid gap-4 py-4">
                    <CustomInput
                        label="Mật khẩu mới"
                        name="password"
                        type="password"
                        value=""
                    />
                    <CustomInput
                        label="Nhập lại"
                        name="confirmPassword"
                        type="password"
                        value=""
                    />
                    <LoadingButton loading={isLoading} text="Thực hiện" />
                </div>
            </form>
        </FormProvider>
    )
}

export default Recovery