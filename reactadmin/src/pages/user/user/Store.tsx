//CORE REACT
import { useEffect, useRef, useState, useCallback } from "react";
import { useQuery } from "react-query";
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
import useSelectBox from "@/hook/useSelectbox";
//SETTING
import { validation } from "@/validations/user/StoreUserValidation";
import { PayloadInput, User } from "@/types/User";
import { Option } from "@/components/CustomSelectBox";
//SERVICE
import { create, getUserById } from "@/service/UserService";

interface UserStoreProps {
    refetch: any;
    closeSheet: () => void,
    userId: string | null,
    action: string
}

const UserStore = ({ userId, action, refetch, closeSheet }: UserStoreProps) => {

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
    const { provinces, districts, wards, setProvinceId, setDistrictId, isProvinceLoading, isDistrictLoading, isWardLoading } = useLocationState()
    const { images, handleImageChange } = useUpload(false)
    const { onSubmitHanler, loading } = useFormSubmit(create, refetch, closeSheet)

    const { data, isLoading, isError } = useQuery<User>(['user', userId],
        () => getUserById(userId),
        {
            enabled: action === 'update' && !!userId,
        }
    )
    const [validationRules, setValidationRules] = useState(() => validation(action, password, undefined))

    //follow data seen update
    useEffect(() => {
        if (!isLoading && data && action === 'update') {
            setValidationRules(validation(action, null, data))
        }
    }, [data])

    const [userCatalogues, setUserCatalogues] = useState([
        { value: '1', label: 'Admin' }
    ])

    const [defaultSelectValue, setDefaultSelectValue] = useState<Option | null>(null)

    const { selectBox, updateSelectBoxValue, updateSelectBoxOptions } = useSelectBox([
        {
            title: 'Loại thành viên',
            placeholder: 'Chọn loại thành viên',
            options: userCatalogues,
            value: defaultSelectValue,
            rules: {
                // required: true
            },
            name: 'user_catalogue_id',
            control: control,
            errors: errors
        },
        {
            title: 'Thành phố',
            placeholder: 'Chọn thành phố',
            options: [],
            value: defaultSelectValue,
            onSelectChange: (value: string | undefined) => {
                setProvinceId(value)
            },
            rules: {},
            name: 'province_id',
            control: control,
            errors
        },
        {
            title: 'Quận/Huyện',
            placeholder: 'Chọn Quận/Huyện',
            options: [],
            value: defaultSelectValue,
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
            options: [],
            value: defaultSelectValue,
            isLoading: isWardLoading,
            rules: {},
            name: 'ward_id',
            control: control,
            errors

        },
    ])

    //Follow Select Value
    useEffect(() => {
        if (!isLoading && data && action === 'update') {
            updateSelectBoxValue('user_catalogue_id', userCatalogues, String(data?.user_catalogue_id))
        }
        if (!isProvinceLoading && provinces.data) {
            updateSelectBoxValue('province_id', provinces.data, String(data?.province_id))
        }
        if (!isDistrictLoading && districts.data) {
            updateSelectBoxValue('district_id', districts.data, String(data?.district_id))

        }
        if (!isWardLoading && wards.data) {
            updateSelectBoxValue('ward_id', wards.data, String(data?.ward_id))

        }
    }, [isLoading, data, isProvinceLoading, provinces, isDistrictLoading, districts, isWardLoading, wards])


    // Follow province
    useEffect(() => {
        if (!isProvinceLoading && provinces.data) {
            updateSelectBoxOptions('province_id', provinces.data)
        }
    }, [provinces, isProvinceLoading])

    //Follow districts
    useEffect(() => {
        if (!isDistrictLoading && districts.data) {
            updateSelectBoxOptions('district_id', districts.data)
        }
    }, [isDistrictLoading, districts])

    //Follow ward
    useEffect(() => {
        if (!isWardLoading && wards.data) {
            updateSelectBoxOptions('ward_id', wards.data)
        }
    }, [isWardLoading, wards])

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
                    defaultValue={data && data.address}
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
                            {(data && data.image && action === 'update')
                                ? <AvatarImage src={data.image} />
                                : <AvatarImage src={images.length > 0 ? images[0].preview : 'https://github.com/shadcn.png'} />
                            }
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