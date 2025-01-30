import LoadingButton from "./LoadingButton"

interface ICustomLogin {
    errors: any,
    register: any,
    loading: boolean
}

const CustomLogin = ({
    errors,
    register,
    loading
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
                <a href="/" className="text-blue-700">Quên mật khẩu</a>
            </p>
            <div className="description text-xs text-gray-700">
                Chào mừng bạn đến với hệ thống đặt lịch khám bệnh version 1.0 của Khanh Bells
            </div>
            <LoadingButton
                loading={loading} text='Đăng nhập'
            />
        </>
    )
}

export default CustomLogin