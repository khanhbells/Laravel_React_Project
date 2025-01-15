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
import { formField } from "../../settings/patientSettings";
import { PayloadInput, Patient } from "@/types/Patient";
import { Option } from "@/components/CustomSelectBox";
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup';
import { PatientCatalogue } from "@/interfaces/types/PatientCatalogueType";
//SERVICE
import { save, getPatientById } from "@/service/PatientService";
import { pagination } from "@/service/PatientCatalogueService";
//INTERFACES
import { SelectBoxItem } from "@/interfaces/BaseServiceInterface";
import { schema } from "../../validations/patient";
import { StoreProps } from "@/interfaces/BaseServiceInterface";

interface PatientStoreProps extends StoreProps {
    patientCatalogueData: { value: string, label: string }[]
}

const Store = ({
    id,
    action,
    refetch,
    closeSheet,
    patientCatalogueData
}: PatientStoreProps) => {




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
    const { data, isLoading, isError } = useQuery<Patient>(['patient', id],
        () => getPatientById(id),
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
                const value = data[key as keyof Patient]

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
            options: patientCatalogueData,
            value: defaultSelectValue,
            name: 'patient_catalogue_id',
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
        if (patientCatalogueData) {
            updateSelectBoxOptions('patient_catalogue_id', patientCatalogueData)
            if (data) {
                updateSelectBoxValue('patient_catalogue_id', patientCatalogueData, String(data?.patient_catalogue_id))
            }
        }
    }, [patientCatalogueData, data, updateSelectBoxValue, updateSelectBoxOptions])




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



    // const { data: dataPatientCatalogues, isLoading: isPatientCatalogueLoading, isError: isPatientCatalogueError } = useQuery(['patient_catalogues'],
    //     () => pagination('sort=name,asc'),
    // )

    // const [patientCatalogues, setPatientCatalogues] = useState([])

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
        </FormProvider>
    )
}

export default Store