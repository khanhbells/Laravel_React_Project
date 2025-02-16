//CORE REACT
import { useEffect, useMemo, useState } from "react";
//COMPONENT
import CustomInput from "@/components/CustomInput";
import CustomSelectBox from "@/components/CustomSelectBox";
import LoadingButton from "@/components/LoadingButton";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
//HOOK
import useFormSubmit from "@/hook/useFormSubmit";
import useLocationState from "@/hook/useLocationState";
import useSelectBox from "@/hook/useSelectbox";
import useUpload from "@/hook/useUpload";
import { FormProvider, useForm } from "react-hook-form";
//SETTING
import { Option } from "@/components/CustomSelectBox";
import { formField } from "@/modules/User/settings/userSettings";
import { PayloadInput } from "@/types/User";
import { yupResolver } from '@hookform/resolvers/yup';
//SERVICE
import { signUp } from "@/service/AuthService";
//INTERFACES
import { SelectBoxItem } from "@/interfaces/BaseServiceInterface";
import { schema } from "@/modules/User/validations/user";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardTitle } from "@/components/ui/card";


const SignUp = () => {

    // const password = useRef({})
    // password.current = watch('password', '')
    //Location
    const { provinces, districts, wards, setProvinceId, setDistrictId, isProvinceLoading, isDistrictLoading, isWardLoading } = useLocationState()
    const { images, handleImageChange } = useUpload(false)
    const navigate = useNavigate()


    const methods = useForm<PayloadInput>({
        resolver: yupResolver(schema),
        mode: 'onSubmit'
    });

    //useForm
    const { register, handleSubmit, reset, formState: { errors }, setValue, control } = methods
    const { onSubmitHanler, loading, isSuccess } = useFormSubmit(signUp, { action: 'create', id: undefined }, null, null, undefined)



    //QUERY


    useEffect(() => {
        if (isSuccess) {
            navigate('/admin')
        }
    }, [isSuccess])

    const [validationRules, setValidationRules] = useState(() => formField('create', undefined))
    const [defaultSelectValue, _] = useState<Option | null>(null)

    const initialSelectBoxs = useMemo<SelectBoxItem[]>(() => [
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

    useEffect(() => {

        if (provinces.data && provinces.data.length) {
            updateSelectBoxOptions('province_id', provinces.data)
        }

    }, [provinces.data, updateSelectBoxValue, updateSelectBoxOptions])

    useEffect(() => {

        if (districts.data && districts.data.length) {
            updateSelectBoxOptions('district_id', districts.data)
        }

    }, [districts.data, updateSelectBoxValue, updateSelectBoxOptions])

    useEffect(() => {
        if (wards.data && wards.data.length) {
            updateSelectBoxOptions('ward_id', wards.data)
        }
    }, [wards.data, updateSelectBoxValue, updateSelectBoxOptions])


    return (
        <div className="bg-sky-100 px-[550px] py-[50px] min-h-screen w-full">
            <Card className="pt-[20px]">
                <CardTitle className="mb-[10px] text-center text-[20px]">Nhập thông tin đăng ký</CardTitle>
                <CardContent>
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
                            <CustomInput
                                name="user_catalogue_id"
                                type="hidden"
                                value="2"
                            />
                        </form>
                    </FormProvider>
                </CardContent>
            </Card>
        </div>


    )
}

export default SignUp