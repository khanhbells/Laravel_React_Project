//REACT
import axios from "../configs/axios";
//COMPONENT
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import UploadSvg from '@/assets/svg/upload.svg'
import SortableItem from "./SortableItem";
//HOOK
import { FieldValues, Path, useFormContext } from "react-hook-form";
//INTERFACE
import { useEffect, useState } from "react";
//CONTEXT
import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, } from '@dnd-kit/sortable';
import { PostCatalogue } from "@/interfaces/types/PostCatalogueType";



export interface ImageUpload {
    file: File | null,
    preview: string,
    progress: number,
    uploaded: boolean
}


interface AlbumProps<T extends FieldValues> {
    onAlbumChange: (images: string[]) => void,
    data?: PostCatalogue
}


const Album = <T extends FieldValues>({
    onAlbumChange,
    data
}: AlbumProps<T>) => {

    const { register, formState: { errors }, control } = useFormContext()

    const [images, setImages] = useState<ImageUpload[]>([])


    //every duyệt qua tất cả phần tử và phải tuân theo điều kiện
    useEffect(() => {
        const allUploaded = images.length > 0 && images.every(image => image.uploaded)
        if (allUploaded) {
            const album = images.map(image => image.preview)
            onAlbumChange(album)
        }
    }, [images, onAlbumChange])

    useEffect(() => {
        console.log(data?.album);

        if (data && data.album.length && Array.isArray(data.album)) {
            const updateAlbum = data.album.map(imageUrl => ({
                file: null,
                preview: `${import.meta.env.VITE_API_URL}/${imageUrl}`,
                progress: 100,
                uploaded: true
            }))
            setImages(updateAlbum)
        }
    }, [data?.album])

    //gui du lieu den backend de luu vao tempotary
    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        // console.log(123);
        const files = event.target.files
        if (files) {
            const newImages: ImageUpload[] = Array.from(files).map(file => ({
                file,
                preview: URL.createObjectURL(file),
                progress: 0,
                uploaded: false
            }))
            setImages(prev => [...prev, ...newImages])
            for (let image of newImages) {
                await uploadImage(image)
            }
        }
    }

    //Xu ly du lieu gui va tra ve
    const uploadImage = async (image: ImageUpload) => {
        try {
            if (!image.file) {
                console.log('File không đúng định dạng');
                return
            }
            const formData = new FormData()
            formData.append('image', image.file)
            try {
                const response = await axios.post('/upload/tempotary', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: (progressEvent) => {
                        if (progressEvent.total) {
                            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
                            setImages(prev => prev.map(img =>
                                img.file === image.file ? { ...img, progress: percentCompleted } : img
                            ))
                        } else {
                            console.log('Không thể tính toán quá trình tải hình ảnh');
                        }
                    }
                })

                const imageUrl = response.data.url

                setImages(prev => prev.map(img =>
                    img.file === image.file ? { ...img, uploaded: true, preview: imageUrl } : img
                ))
            } catch (error) {
                setImages(prev => prev.map(img =>
                    img.file === image.file ? { ...img, uploaded: false, progress: 0 } : img
                ))
            }
        } catch {

        }

    }

    //Xoa anh trong album
    const removeImage = (id: string) => {
        setImages(prev => prev.filter(image => image.preview && image.preview !== id))
    }



    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event

        if (active.id !== over?.id) {
            const oldIndex = images.findIndex(image => image.preview === active.id)
            const newIndex = images.findIndex(image => image.preview === over?.id)
            if (oldIndex === -1 || newIndex === -1) {
                return
            }
            const updateImages = [...images]
            updateImages.splice(newIndex, 0, updateImages.splice(oldIndex, 1)[0])

            setImages(updateImages)

        }

    }

    return (
        <>
            <Card className="rounded-[5px] mb-[20px]">
                <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                    <CardTitle className="flex justify-between items-center">
                        <span className="uppercase">Album ảnh</span>
                        <label htmlFor="chooseImage" className="cursor-pointer text-[blue] text-[14px] font-medium">Chọn hình ảnh</label>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-[15px] text-center items-center p-[20px]">
                    {images && images.length
                        ?
                        (
                            <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
                                <SortableContext items={images.map(image => image.preview)}>
                                    <div className="grid grid-cols-6 gap-4">
                                        {images.map((image, index) => (
                                            <SortableItem
                                                id={image.preview}
                                                index={index}
                                                key={index}
                                                image={image}
                                                removeImage={removeImage}
                                            />
                                        ))}
                                    </div>
                                </SortableContext>
                            </DndContext>

                        ) : (
                            <label htmlFor="chooseImage" className="click-to-upload border border-dashed border-1 border-[#ccced1] p-[20px] text-center cursor-pointer block">
                                <div className="icon ">
                                    <img src={UploadSvg} alt="Upload Icon" className="size-20 mb-2 inline-block" />
                                </div>
                                <div className="text-center text-[14px]">Sử dụng nút chọn hình hoặc click vào đây để thêm hình ảnh</div>
                            </label>
                        )}

                    <input
                        type="file"
                        id="chooseImage"
                        className="hidden size-full absolute inset-0 cursor-pointer"
                        multiple
                        accept="image/"
                        {...register('album' as Path<T>, {
                            onChange: handleImageChange
                        })}
                    />
                </CardContent >
            </Card >
        </>
    )
}

export default Album