//REACT
import { useState } from "react";
//COMPONENT
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useForm, SubmitHandler } from "react-hook-form";
import LoadingButton from "@/components/LoadingButton"
import CustomInput from "@/components/CustomInput";
//HELPERS
import { showToast } from "@/helper/myHelper";
import { handleAxiosError } from "@/helper/axiosHelper";
type Inputs = {
    password: string,
    re_password: string
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

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>()

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
        <form onSubmit={handleSubmit(changePasswordHanler)}>
            <div className="grid gap-4 py-4">
                <CustomInput
                    register={register}
                    errors={errors}
                    label="Mật khẩu mới"
                    name="password"
                    type="password"
                    value=""
                />
                <CustomInput
                    register={register}
                    errors={errors}
                    label="Nhập lại"
                    name="re_password"
                    type="password"
                    value=""
                />
                <LoadingButton loading={isLoading} text="Thực hiện" />
            </div>
        </form>
    )
}

export default Recovery