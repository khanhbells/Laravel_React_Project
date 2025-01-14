import { useState } from "react"

interface ImageUploadResult {
    file: File,
    preview: string,

}

const useUpload = (multiple: boolean = false) => {

    const [images, setImages] = useState<ImageUploadResult[]>([])

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files)
            const imagePreviews = files.map((file) => ({
                file,
                preview: URL.createObjectURL(file)
            }))
            console.log(imagePreviews);
            setImages(multiple ? [...images, ...imagePreviews] : imagePreviews)

        }
    }

    //splice xóa phần tử trong mảng
    const deleteImage = (index: number) => {
        const newImages = [...images]
        newImages.splice(index, 1)
        setImages(newImages)
    }
    return {
        images,
        setImages,
        handleImageChange,
        deleteImage
    }
}

export default useUpload