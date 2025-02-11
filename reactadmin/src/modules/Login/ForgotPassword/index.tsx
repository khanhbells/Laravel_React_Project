import { Inputs } from "@/modules/Login/SignIn";
import { forgotPassword } from "@/service/AuthService";
import { SubmitHandler, useForm } from "react-hook-form";
import LoadingButton from "@/components/LoadingButton";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { setToast } from "@/redux/slide/toastSlice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { IForgotPassword } from "@/interfaces/ForgotPasswordInterface";


const ForgotPassword = () => {

    const dispatch = useDispatch()
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Inputs>()
    const [loading, setLoading] = useState<boolean>(false)
    const loginHandler: SubmitHandler<IForgotPassword> = async (payload) => {
        setLoading(true)
        try {
            const auth = await forgotPassword(payload)
        } catch (error) {
        } finally {
            setLoading(false)
        }
    };

    return (
        <>
            <div className="bg-sky-100 px-[550px] py-[50px] min-h-screen">
                <Card className="pt-[20px]">
                    <CardTitle className="mb-[10px] text-center text-[20px]">Nhập email quên mật khẩu</CardTitle>
                    <CardContent>
                        <form onSubmit={handleSubmit(loginHandler)}>
                            <div className="mb-4">
                                <input
                                    type="text"
                                    id="email"
                                    placeholder="Email..."
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus-blue-200 h-11"
                                    {...register("email", { required: true })}
                                />
                                {errors.email && <span className="text-red-500 text-xs">Bạn phải nhập vào email</span>}
                            </div>
                            <LoadingButton
                                loading={loading} text='Gửi email'
                            />
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    )
}

export default ForgotPassword