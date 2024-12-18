//CORE REACT
import { useEffect, useRef } from "react";
//COMPONENT
import CustomInput from "@/components/CustomInput"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import LoadingButton from "@/components/LoadingButton"
import CustomSelectBox from "@/components/CustomSelectBox"
//HOOK
import { useForm } from "react-hook-form";
import useLocationState from "@/hook/useLocationState";
import useUpload from "@/hook/useUpload";
import useFormSubmit from "@/hook/useFormSubmit";
//SETTING
import { validation } from "@/validations/user/StoreUserValidation";
import { PayloadInput } from "@/types/User";
//SERVICE
import { create } from "@/service/UserService";

interface UserStoreProps {
    refetch: any;
    closeSheet: () => void
}

const UserStore = ({ refetch, closeSheet }: UserStoreProps) => {

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
        control
    } = useForm<PayloadInput>()

    const password = useRef({})
    password.current = watch('password', '')
    //Location
    const { provinces, districts, wards, setProvinceId, setDistrictId, isDistrictLoading, isWardLoading } = useLocationState()
    const { images, handleImageChange } = useUpload(false)
    const { onSubmitHanler, loading } = useFormSubmit(create, refetch, closeSheet)
    const validationRules = validation(password)

    const selectBox = [
        {
            title: 'Loại thành viên',
            placeholder: 'Chọn loại thành viên',
            options: [
                { value: '1', label: 'Admin' }
            ],
            // defaultValue: { value: '1', label: 'Admin' },
            rules: {
                // required: true
            },
            name: 'user_catalogue_id',
            control: control,
            errors
        },
        {
            title: 'Thành phố',
            placeholder: 'Chọn thành phố',
            options: provinces.data,
            onSelectChange: (value: string | undefined) => setProvinceId(value),
            rules: {},
            name: 'province_id',
            control: control,
            errors
        },
        {
            title: 'Quận/Huyện',
            placeholder: 'Chọn Quận/Huyện',
            options: districts.data,
            onSelectChange: (value: string | undefined) => setDistrictId(value),
            isLoading: isDistrictLoading,
            rules: {},
            name: 'district_id',
            control: control,
            errors
        },
        {
            title: 'Phường Xã',
            placeholder: 'Chọn Phường Xã',
            options: wards.data,
            isLoading: isWardLoading,
            rules: {},
            name: 'ward_id',
            control: control,
            errors

        },
    ]

    // useEffect(() => {
    //     console.log(images);

    // }, [images])

    return (
        <form onSubmit={handleSubmit(onSubmitHanler)}>
            <div className="grid gap-4 py-4">
                {validationRules && validationRules.map((item, index) => (
                    <CustomInput
                        key={index}
                        register={register}
                        errors={errors}
                        {...item}
                    />
                ))}
                {selectBox && selectBox.map((item, index) => (
                    <CustomSelectBox
                        key={index}
                        {...item}
                        register={register}
                    />
                ))}

                <CustomInput
                    label="Địa chỉ"
                    name="address"
                    type="text"
                    register={register}
                    errors={errors}
                />
                <input
                    type="file"
                    accept="image/"
                    id="upload-image"
                    className="hidden"
                    {...register('image', {
                        onChange: handleImageChange
                    })}
                />
                <div className="text-center">
                    <label htmlFor="upload-image">
                        <Avatar className="w-[100px] h-[100px] inline-block cursor-pointer shadow-md border">
                            <AvatarImage src={images.length > 0 ? images[0].preview : 'https://github.com/shadcn.png'} />
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </label>
                </div>

            </div>
            <div className="text-right">
                <LoadingButton
                    loading={loading}
                    text="Lưu thông tin"
                />
            </div>
        </form>
    )
}

export default UserStore