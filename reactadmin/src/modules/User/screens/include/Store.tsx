//CORE REACT
import { useEffect, useRef, useState, useMemo } from "react";
import { useQuery } from "react-query";
//COMPONENT
import CustomInput from "@/components/CustomInput"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import LoadingButton from "@/components/LoadingButton"
import CustomSelectBox from "@/components/CustomSelectBox"
//HOOK
import { FormProvider, useForm } from "react-hook-form";
import useLocationState from "@/hook/useLocationState";
import useUpload from "@/hook/useUpload";
import useFormSubmit from "@/hook/useFormSubmit";
import useSelectBox from "@/hook/useSelectbox";
//SETTING
import { formField } from "../../settings/userSettings";
import { PayloadInput, User } from "@/types/User";
import { Option } from "@/components/CustomSelectBox";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
import { UserCatalogue } from "@/interfaces/types/UserCatalogueType";
//SERVICE
import { save, getUserById } from "@/service/UserService";
import { pagination } from "@/service/UserCatalogueService";
//INTERFACES
import { SelectBoxItem } from "@/interfaces/BaseServiceInterface";
import { schema } from "../../validations/user";
import { StoreProps } from "@/interfaces/BaseServiceInterface";

interface UserStoreProps extends StoreProps {
    userCatalogueData: { value: string, label: string }[]
}

const UserStore = ({
    id,
    action,
    refetch,
    closeSheet,
    userCatalogueData
}: UserStoreProps) => {




    // const password = useRef({})
    // password.current = watch('password', '')
    //Location
    const { provinces, districts, wards, setProvinceId, setDistrictId, isProvinceLoading, isDistrictLoading, isWardLoading } = useLocationState()
    const { images, handleImageChange } = useUpload(false)


    const methods = useForm<PayloadInput>({
        context: { action },
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    });

    //useForm
    const { register, handleSubmit, reset, formState: { errors }, setValue, control } = methods
    const { onSubmitHanler, loading } = useFormSubmit(save, { action: action, id: id }, null, refetch, closeSheet)



    //QUERY
    const { data, isLoading, isError } = useQuery<User>(['user', id],
        () => getUserById(id),
        {
            enabled: action === 'update' && !!id,
        }
    )




    const [validationRules, setValidationRules] = useState(() => formField(action, undefined))



    //follow data seen update
    useEffect(() => {
        if (!isLoading && data && action === 'update') {
            setValidationRules(formField(action, data))
            Object.keys(data).forEach((key) => {
                const value = data[key as keyof User]

                if (typeof value === 'string' || value === undefined) {
                    setValue(key as keyof PayloadInput, value)
                } else {
                    setValue(key as keyof PayloadInput, String(value))
                }


            })

        }
    }, [data])


    const [defaultSelectValue, _] = useState<Option | null>(null)

    const initialSelectBoxs = useMemo<SelectBoxItem[]>(() => [
        {
            title: 'Loại thành viên',
            placeholder: 'Chọn loại thành viên',
            options: userCatalogueData,
            value: defaultSelectValue,
            name: 'user_catalogue_id',
            control: control,
        },
        {
            title: 'Thành phố',
            placeholder: 'Chọn thành phố',
            options: [],
            value: defaultSelectValue,
            onSelectChange: (value: string | undefined) => {
                setProvinceId(value)
            },
            name: 'province_id',
            control: control,
        },
        {
            title: 'Quận/Huyện',
            placeholder: 'Chọn Quận/Huyện',
            options: [],
            value: defaultSelectValue,
            onSelectChange: (value: string | undefined) => setDistrictId(value),
            isLoading: isDistrictLoading,
            name: 'district_id',
            control: control,
        },
        {
            title: 'Phường Xã',
            placeholder: 'Chọn Phường Xã',
            options: [],
            value: defaultSelectValue,
            isLoading: isWardLoading,
            name: 'ward_id',
            control: control,

        },
    ], [defaultSelectValue, setProvinceId, setDistrictId, control])

    const { selectBox, updateSelectBoxValue, updateSelectBoxOptions } = useSelectBox(initialSelectBoxs)



    //follow update value and option
    useEffect(() => {
        if (userCatalogueData) {
            updateSelectBoxOptions('user_catalogue_id', userCatalogueData)
            if (data) {
                updateSelectBoxValue('user_catalogue_id', userCatalogueData, String(data?.user_catalogue_id))
            }
        }
    }, [userCatalogueData, data, updateSelectBoxValue, updateSelectBoxOptions])




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



    // const { data: dataUserCatalogues, isLoading: isUserCatalogueLoading, isError: isUserCatalogueError } = useQuery(['user_catalogues'],
    //     () => pagination('sort=name,asc'),
    // )

    // const [userCatalogues, setUserCatalogues] = useState([])

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmitHanler)}>
                <div className="grid gap-4 py-4">
                    {validationRules && validationRules.map((item, index) => (
                        <CustomInput
                            key={index}
                            {...item}
                        />
                    ))}
                    {selectBox && selectBox.map((item, index) => (
                        <CustomSelectBox
                            key={index}
                            {...item}
                            register={register}
                            errors={errors}
                        />
                    ))}

                    <CustomInput
                        label="Địa chỉ"
                        name="address"
                        type="text"
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
                                    <AvatarImage src='/src/assets/upload-image.jpg' />
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
        </FormProvider>
    )
}

export default UserStore