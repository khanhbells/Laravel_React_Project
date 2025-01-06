import axios from "@/configs/axios"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"


import UploadSvg from '@/assets/svg/upload.svg'

import SortableItem from "./SortableItem"

import { FieldValues, Path, useForm, useFormContext } from "react-hook-form"
import { useEffect, useMemo, useState } from "react";

import { closestCenter, DndContext, DragEndEvent } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';


import { useRef, memo } from "react"

export interface ImageUpload {
    file: File | null,
    preview: string,
    progress: number,
    uploaded: boolean
}

interface AlbumProps<T extends FieldValues> {
    onAlbumChange: (images: string[]) => void,
    data?: T
}

const Album = <T extends FieldValues>({
    onAlbumChange,
    data
}: AlbumProps<T>) => {

    const updateAlbum = useMemo(() => {
        if (data && Array.isArray(data.album) && data.album.length > 0) {
            return data.album.map(imageUrl => ({
                file: null,
                preview: `${import.meta.env.VITE_API_URL}/${imageUrl}`,
                progress: 100,
                uploaded: true
            }))
        }
        return []
    }, [data])

    const [images, setImages] = useState<ImageUpload[]>(updateAlbum)

    useEffect(() => {
        const allUploaded = images.length > 0 && images.every(image => image.uploaded)
        if (allUploaded) {
            const album = images.map(image => image.preview)
            onAlbumChange(album)
        }
    }, [images])

    useEffect(() => {
        if (updateAlbum.length) {
            setImages(updateAlbum)

        }
    }, [updateAlbum])


    const handleImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        if (files) {
            const newImages: ImageUpload[] = Array.from(files).map(file => ({
                file,
                preview: URL.createObjectURL(file),
                progress: 0,
                uploaded: false
            }))
            setImages(prev => [...prev, ...newImages])

            const updateImages = await Promise.all(newImages.map(image => uploadImage(image)));
            const validUpdatedImages = updateImages.filter((img): img is ImageUpload => img !== undefined)

            if (validUpdatedImages.length) {
                setImages(prev => prev.map(img => validUpdatedImages.find(updated => updated.file === img.file) || img))
            }
        }
    }

    const uploadImage = async (image: ImageUpload) => {
        try {
            if (!image.file) {
                console.log('File ko đúng định dạng');
                return
            }

            const formData = new FormData()
            formData.append('image', image.file)

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
            return { ...image, uploaded: true, preview: imageUrl, progress: 100 }

        } catch (error) {

            setImages(prev => prev.map(img =>
                img.file === image.file ? { ...img, uploaded: false, progress: 0 } : img
            ))

        }
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

    const removeImage = (id: string) => {
        setImages(prev => prev.filter(image => image.preview !== id))
    }

    return (

        <Card className="rounded-[5px] mb-[20px]">
            <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                <CardTitle className=" flex justify-between items-center">
                    <span className="uppercase">Album Ảnh</span>
                    <label htmlFor="chooseImage" className="cursor-pointer text-[blue] text-[14px] font-medium">Chọn Hình ảnh </label>
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-[15px] text-center items-center p-[20px]">
                {images && images.length
                    ? (
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
                    )
                    : (
                        <label htmlFor="chooseImage" className="click-to-upload border border-dashed border-1 border-[#ccced1] p-[20px] text-center cursor-pointer block">
                            <div className="icon">
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
                    onChange={handleImageChange}
                />

            </CardContent>
        </Card>
    )
}

export default memo(Album)


