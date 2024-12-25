//CORE REACT
import { useEffect, useRef, useState, useMemo } from "react";
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
import { keys } from "ts-transformer-keys";
//SERVICE
import { save, getUserById } from "@/service/UserService";
//INTERFACES
import { SelectBoxItem } from "@/interfaces/BaseServiceInterface";

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
        control,
        setValue
    } = useForm<PayloadInput>()

    const password = useRef({})
    password.current = watch('password', '')
    //Location
    const { provinces, districts, wards, setProvinceId, setDistrictId, isProvinceLoading, isDistrictLoading, isWardLoading } = useLocationState()
    const { images, handleImageChange } = useUpload(false)
    const { onSubmitHanler, loading } = useFormSubmit(save, refetch, closeSheet, { action: action, id: userId })

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
            Object.keys(data).forEach((key) => {
                const value = data[key as keyof User]

                if (typeof value === 'string' || value === null) {
                    setValue(key as keyof PayloadInput, value)
                } else {
                    setValue(key as keyof PayloadInput, String(value))
                }


            })

        }
    }, [data])

    const [userCatalogues, setUserCatalogues] = useState([
        { value: '1', label: 'Admin' }
    ])

    const [defaultSelectValue, setDefaultSelectValue] = useState<Option | null>(null)

    const initialSelectBoxs = useMemo<SelectBoxItem[]>(() => [
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
    ], [userCatalogues, defaultSelectValue, setProvinceId, setProvinceId, setDistrictId])

    const { selectBox, updateSelectBoxValue, updateSelectBoxOptions } = useSelectBox(initialSelectBoxs)


    //follow update value and option
    useEffect(() => {
        if (data) {
            updateSelectBoxValue('user_catalogue_id', userCatalogues, String(data?.user_catalogue_id))
        }
    }, [userCatalogues, data, updateSelectBoxValue, updateSelectBoxOptions])

    useEffect(() => {

        if (provinces.data && provinces.data.length) {
            updateSelectBoxOptions('province_id', provinces.data)
            if (data) {
                updateSelectBoxValue('province_id', provinces.data, String(data?.province_id))
            }
        }

    }, [provinces.data, data, updateSelectBoxValue, updateSelectBoxOptions])

    useEffect(() => {

        if (districts.data && districts.data.length) {
            updateSelectBoxOptions('district_id', districts.data)
            if (data) {
                updateSelectBoxValue('district_id', districts.data, String(data?.district_id))
            }
        }

    }, [districts.data, data, updateSelectBoxValue, updateSelectBoxOptions])

    useEffect(() => {
        if (wards.data && wards.data.length) {
            updateSelectBoxOptions('ward_id', wards.data)
            if (data) {
                updateSelectBoxValue('ward_id', wards.data, String(data?.ward_id))
            }
        }
    }, [wards.data, data, updateSelectBoxValue, updateSelectBoxOptions])

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
                    value={data && data.address}
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
                            {images.length > 0 ? (
                                <AvatarImage src={images[0].preview} />
                            ) : data && data.image ? (
                                <AvatarImage src={data.image} />
                            ) : (
                                <AvatarImage src='https://github.com/shadcn.png' />
                            )}
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