const Login = () => {

    return (
        <>
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-4 rounded-md shadow-lg w-full max-w-md">
                    <h1 className="text-2xl font-medium mb-6 text-center">Đăng nhập</h1>
                    <form action="">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-2">Email:</label>
                            <input
                                type="text"
                                id="email"
                                placeholder=""
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus-blue-200 h-11"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 text-sm font-medium mb-2">Mật khẩu:</label>
                            <input
                                type="password"
                                id="password"
                                placeholder=""
                                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring focus-blue-200 h-11"
                            />
                        </div>
                        <div className="mb-3">
                            <button
                                type="submit"
                                className="w-full bg-blue-500 text-white hover:bg-blue-700 py-3 rounded-md"
                            >
                                Đăng nhập
                            </button>
                        </div>
                        <p className="text-center text-gray-700">
                            <a href="/" className="text-blue-700">Quên mật khẩu</a>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default Login