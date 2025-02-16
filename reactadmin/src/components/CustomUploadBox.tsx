import { useEffect, useState } from "react";
import UploadIcon from "@/assets/upload-image.jpg";
import { useFormContext, Path, FieldValues } from "react-hook-form";

interface ICustomUploadBoxProps<T extends FieldValues> {
    label: string;
    name: string;
    data?: string;
}

interface ImageUploadResult {
    file: File;
    preview: string;
}

const CustomUploadBox = <T extends FieldValues>({
    name,
    label,
    data
}: ICustomUploadBoxProps<T>) => {
    const { register, formState: { errors } } = useFormContext();
    const [images, setImages] = useState<ImageUploadResult[]>([]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);

            const imagePreviews = files.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));
            console.log(imagePreviews);

            setImages(imagePreviews); // Cập nhật trạng thái riêng cho từng input
        }
    };

    const errorMessage = errors[name]?.message


    return (
        <div>
            <div className="flex flex-col items-center bg-gray-100 p-4 rounded-md shadow-inner">
                <label htmlFor={name} className="size-25 flex items-center justify-center bg-gray-200 rounded-full cursor-pointer overflow-hidden relative">
                    <input
                        type="file"
                        id={name}
                        className="opacity-0 size-full absolute inset-0 cursor-pointer"
                        {...register(name as Path<T>, {
                            onChange: handleImageChange
                        })}
                    />
                    {images.length > 0 ? (
                        <img src={images[0].preview} alt="preview" />
                    ) : data ? (
                        <img src={data} alt="uploaded" />
                    ) : (
                        <img src={UploadIcon} alt="default" />
                    )}
                </label>
                <span className="text-gray-700 font-medium text-[13px] mt-[5px]">{label}</span>
                {errorMessage && (
                    <div className="error-line text-right mt-[-10px]">
                        {typeof errorMessage === 'string' && (
                            <span className="text-red-500 text-xs">{errorMessage}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomUploadBox;
