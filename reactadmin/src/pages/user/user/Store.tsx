import CustomInput from "@/components/CustomInput"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import LoadingButton from "@/components/LoadingButton"
import { useForm, SubmitHandler } from "react-hook-form";
import { create, validation } from "@/service/UserService";
//Custom Select
import CustomSelectBox from "@/components/CustomSelectBox"
import { useRef, useState } from "react";
//Store

type Inputs = {
    name: string,
    email: string,
    phone: string,
    password: string,
    re_password: string,
    birthday: string
};

const UserStore = () => {

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm<Inputs>()
    const [loading, setLoading] = useState<boolean>(false)
    const password = useRef({})
    password.current = watch('password', '')

    const onSubmitHanler: SubmitHandler<Inputs> = async (payload) => {
        try {
            await create(payload)
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    const validationRules = validation(password)

    const selectBox = [
        {
            title: 'Loại thành viên',
            placeholder: 'Chọn loại thành viên',
            options: [
                { value: '1', label: 'Admin' }
            ],
            defaultValue: { value: '1', label: 'Admin' }
        },
        {
            title: 'Thành phố',
            placeholder: 'Chọn thành phố',
            options: [
                { value: '1', label: 'Thái Nguyên' }
            ]
        },
        {
            title: 'Quận/Huyện',
            placeholder: 'Chọn Quận/Huyện',
            options: [
                { value: '1', label: 'Thái Nguyên' }
            ]
        },
        {
            title: 'Phường Xã',
            placeholder: 'Chọn Phường Xã',
            options: [
                { value: '1', label: 'Phường Đồng Quang' }
            ]
        },
    ]

    return (
        <form onSubmit={handleSubmit(create)}>
            <div className="grid gap-4 py-4">
                {validationRules && validationRules.map((item, index) => (
                    <CustomInput
                        key={index}
                        register={register}
                        errors={errors}
                        {...item}
                    />
                ))}
                {/* <CustomInput
                    label="Ảnh đại diện"
                    id="image"
                    type="file"
                /> */}
                <div className="text-center">
                    <Avatar className="w-[100px] h-[100px] inline-block">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                </div>
                {selectBox && selectBox.map((item, index) => (
                    <CustomSelectBox
                        key={index}
                        {...item}
                    />
                ))}
                {/* <CustomInput
                    label="Địa chỉ"
                    id="address"
                    type="text"
                /> */}
            </div>
            <div className="text-right">
                <LoadingButton
                    loading={false}
                    text="Lưu thông tin"
                />
            </div>
        </form>
    )
}

export default UserStore