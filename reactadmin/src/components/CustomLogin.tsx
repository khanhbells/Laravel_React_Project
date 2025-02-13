import { Link } from "react-router-dom"
import LoadingButton from "./LoadingButton"
import { canonical } from "@/constant/canonical"

interface ICustomLogin {
    errors: any,
    register: any,
    loading: boolean,
    forgotPassword?: boolean,
    [key: string]: any
}

const CustomLogin = ({
    errors,
    register,
    loading,
    forgotPassword,
    restProps
}: ICustomLogin) => {
    return (
        <>
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
            <div className="mb-4">
                <input
                    type="password"
                    id="password"
                    placeholder="Mật khẩu..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus-blue-200 h-11"
                    {...register("password", { required: true })}
                />
                {errors.password && <span className="text-red-500 text-xs">Bạn phải nhập vào mật khẩu</span>}
            </div>
            <div className="mb-3">

            </div>
            <p className="text-xs mb-2 text-gray-700">
                <div className="flex justify-between">
                    <Link
                        className="text-blue-700"
                        to={`${forgotPassword ? `${canonical.patientForgotPassword}` : '/admin/forgotPassword'}`}
                    >
                        Quên mật khẩu
                    </Link>
                    <span>Chưa có tài khoản? <Link className="text-blue-700" to={`${forgotPassword ? `${canonical.patientSignUp}` : '/admin/signup'}`}>Đăng ký ngay</Link></span>
                </div>
            </p>
            <div className="description text-xs text-gray-700 mb-[10px]">
                Chào mừng bạn đến với hệ thống đặt lịch khám bệnh version 1.0 của Khanh Bells
            </div>
            <LoadingButton
                loading={loading} text='Đăng nhập'
            />
        </>
    )
}

export default CustomLogin