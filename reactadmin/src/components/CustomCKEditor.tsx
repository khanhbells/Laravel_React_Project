import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Label } from "./ui/label";
import { Controller, FieldErrors, FieldValues } from "react-hook-form"
import { resolve } from "path";
import axios from "../configs/axios";
import { useEffect, useRef, useState } from "react";

interface CustomCKEditorProps<T extends FieldValues> {
    label: string,
    className?: string,
    name: string,
    control?: any,
    errors: FieldErrors<T>
}

class CustomUploadPlugin {
    constructor(editor: any) {
        editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
            return new MyUploadAdapter(loader);
        }
    }
}

class MyUploadAdapter {

    private loader: any

    constructor(loader: any) {
        this.loader = loader
    }

    upload() {
        return new Promise((resolve, reject) => {
            this.loader.file.then((file: File) => {
                const formData = new FormData()
                formData.append('image', file)
                axios.post('upload/ckeditor', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }).then((res) => {
                    resolve({
                        default: res.data.url
                    })
                }).catch((err) => {
                    reject(err)
                })
            })
        })
    }
}

const CustomCKEditor = <T extends FieldValues>({
    label,
    className,
    name,
    control,
    errors
}: CustomCKEditorProps<T>) => {

    const errorMessage = errors[name]?.message
    const editorRef = useRef<any>(null)

    const [previousImage, setPreviousImage] = useState<string[]>([])

    const handleEditorReady = (editor: any) => {
        editorRef.current = editor
        editor.model.document.on('change:data', () => {
            const data = editor.getData()
            const currentImages = Array.from(editor.model.document.getRoot().getChildren()).
                filter((item: any) => item.name === 'imageBlock').
                map((item: any) => item.getAttribute('src'))

            // const removeImage = getPreviousImage().filter(src => !currentImages.includes(src))
            setPreviousImage(prev => {
                const removeImage = prev.filter(src => !currentImages.includes(src))
                removeImage.forEach((src) => deleteImageFromCkeditor(src))
                return currentImages
            })
        })
    }


    const deleteImageFromCkeditor = (src: string) => {
        axios.post('delete/ckeditor', { url: src })
            .then(() => console.log('Ảnh đã được xóa'))
            .catch((err) => console.error('Xóa ảnh bị lỗi', err))
    }

    return (
        <div className={`gap-4 ${className ?? null}`}>
            <Label className="mb-[10px] block mt-[10px]">
                {label}
            </Label>
            {/* Controller de kiem soat du lieu nhap vao hoac thay doi */}
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <CKEditor
                        editor={ClassicEditor}
                        data=""
                        config={
                            {
                                extraPlugins: [CustomUploadPlugin]
                            }
                        }
                        onReady={(editor) => handleEditorReady(editor)}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            field.onChange(data)
                        }}
                    />
                )}
            />
            {
                errorMessage &&
                <div className="error-line text-right mt-[-10px]" >
                    {typeof errorMessage === 'string' && (
                        <span className="text-red-500 text-xs">{errorMessage}</span>
                    )}
                </div>
            }
        </div>
    )
}

export default CustomCKEditor