import CustomLogin from "@/components/CustomLogin";
import { changePassword } from "@/service/Frontend/AuthPatientService";
import { useNavigate, useSearchParams } from "react-router-dom";
// import { useToast } from "../contexts/ToastContext";
import { setAuthPatientLogin } from "@/redux/slide/authPatientSlice";
import { setToast } from "@/redux/slide/toastSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import LoadingButton from "@/components/LoadingButton";
import { useForm, SubmitHandler, FormProvider } from "react-hook-form";
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'
import { showToast } from "@/helper/myHelper";
import CustomInput from "@/components/CustomInput";
export interface ResetPassword {
    email: string
}
type Inputs = {
    password: string,
    confirmPassword: string
};
const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const email = searchParams.get("email");

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
            const res = await changePassword(payload, token, email)
            if (res.code === 200) {
                showToast(res.message, res.code === 200 ? 'success' : 'error')
                navigate('/patient/signin')
            }
        } finally {
            setIsLoading(false)
        }

    };


    return (
        <>
            <div className="bg-sky-100 px-[550px] py-[50px]">
                <Card className="pt-[20px]">
                    <CardTitle className="mb-[10px] text-center text-[20px]">Cập nhật mật khẩu</CardTitle>
                    <CardContent>
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

                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default ResetPassword