import CustomLogin from "@/components/CustomLogin";
import { Inputs } from "@/modules/Login";
import { login } from "@/service/Frontend/AuthPatientService";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
// import { useToast } from "../contexts/ToastContext";
import { setAuthPatientLogin } from "@/redux/slide/authPatientSlice";
import { setToast } from "@/redux/slide/toastSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
const SignIn = () => {
    const navigate = useNavigate()

    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>()
    const [loading, setLoading] = useState<boolean>(false)
    const loginHandler: SubmitHandler<Inputs> = async (payload) => {
        setLoading(true)
        try {
            const authPatient = await login(payload)

            if (authPatient) {
                dispatch(setToast({ message: 'Đăng nhập vào hệ thống thành công', type: 'success' }))
                dispatch(setAuthPatientLogin(authPatient))
                // setMessage('Đăng nhập vào hệ thống thành công', 'success')-- > context
                navigate(-1)
            }
        } catch (error) {
        } finally {
            setLoading(false)
        }
    };

    return (
        <>
            <div className="bg-sky-100 px-[550px] py-[50px]">
                <Card className="pt-[20px]">
                    <CardTitle className="mb-[10px] text-center text-[20px]">Đăng nhập</CardTitle>
                    <CardContent>
                        <form onSubmit={handleSubmit(loginHandler)}>
                            <CustomLogin
                                errors={errors}
                                register={register}
                                loading={loading}
                            />
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default SignIn