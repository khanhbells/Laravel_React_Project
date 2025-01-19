import React, { useState } from "react"
interface ImageUploadResult {
    file: File;
    preview: string;
}

const useUploadMultiple = () => {
    const [images, setImages] = React.useState<Record<string, ImageUploadResult[]>>({});

    const handleImageChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files) {
            const files = Array.from(event.target.files);
            const imagePreviews = files.map((file) => ({
                file,
                preview: URL.createObjectURL(file),
            }));

            setImages((prev) => ({
                ...prev,
                [key]: imagePreviews,
            }));
        }
    };

    const deleteImage = (key: string, index: number) => {
        setImages((prev) => {
            const newImages = [...(prev[key] || [])];
            newImages.splice(index, 1);
            return { ...prev, [key]: newImages };
        });
    };

    return { images, handleImageChange, deleteImage };
};
export default useUploadMultiple