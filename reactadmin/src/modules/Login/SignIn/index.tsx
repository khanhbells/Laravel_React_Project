import { useForm, SubmitHandler } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { login } from "../../../service/AuthService";
// import { useToast } from "../contexts/ToastContext";
import { setToast } from "../../../redux/slide/toastSlice";
import { useDispatch } from "react-redux";
import { Button } from "../../../components/ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import { setAuthLogin } from "../../../redux/slide/authSlice";
import LoadingButton from "@/components/LoadingButton";
import CustomLogin from "@/components/CustomLogin";
import LeftLogin from "@/components/CustomLeftLogin";

export type Inputs = {
    email: string
    password: string
};

const Login = () => {
    // const { setMessage } = useToast()s
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
            const auth = await login(payload)
            dispatch(setToast({ message: 'Đăng nhập vào hệ thống thành công', type: 'success' }))
            dispatch(setAuthLogin(auth))
            // setMessage('Đăng nhập vào hệ thống thành công', 'success')-- > context
            auth && navigate('/dashboard')
        } catch (error) {
        } finally {
            setLoading(false)
        }
    };
    return (
        <>
            <div className="min-h-screen pt-24 items-center justify-center bg-gray-100">
                <div className="max-w-screen-md mx-auto">
                    <div className="grid grid-cols-2 gap-4">
                        <LeftLogin />
                        <div className="bg-white p-5 rounded shadow-lg w-full max-w-md">
                            <form onSubmit={handleSubmit(loginHandler)}>
                                <CustomLogin
                                    errors={errors}
                                    register={register}
                                    loading={loading}
                                    forgotPassword={false}
                                />
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login