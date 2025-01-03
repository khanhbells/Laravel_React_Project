import { useEffect, useState } from "react"
import UploadIcon from "@/assets/upload-image.jpg";

import { UseFormRegister, FieldValues, FieldErrors, Controller, Path } from "react-hook-form";
import useUpload from "@/hook/useUpload";
interface ICustomUploadBoxProps<T extends FieldValues> {
    label: string,
    name: string,
    register: UseFormRegister<T>,
    errors: FieldErrors<T>,
    control: any
}
const CustomUploadBox = <T extends FieldValues>({
    name,
    label,
    register,
    errors,
    control
}: ICustomUploadBoxProps<T>) => {


    const { images, handleImageChange } = useUpload(false)

    useEffect(() => {
        console.log(images);
    }, [images])

    return (
        <div className="flex flex-col items-center bg-gray-100 p-4 rounded-md shadow-inner">
            <label htmlFor={name} className="size-25 flex -items-center justify-center bg-gray-200 rounded-full cursor-pointer overflow-hidden relative">
                <input
                    type="file"
                    id={name}
                    className="opacity-0 size-full absolute inset-0 cursor-pointer"
                    {...register(name as Path<T>, {
                        onChange: handleImageChange
                    })}
                />
                {images.length > 0 ? (
                    <img src={images[0].preview} alt="" />
                ) : (
                    <img src={UploadIcon} alt="" />
                )}

            </label>
            <span className="text-gray-700 font-medium text-[13px] mt-[5px]">{label}</span>
        </div>
    )
}

export default CustomUploadBox