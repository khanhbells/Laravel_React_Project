//API
import axios from "../configs/axios";
import {
    Card,
    CardContent,
} from "@/components/ui/card";
import CustomInput from "@/components/CustomInput";
import { Label } from "@/components/ui/label"
import Select from "react-select"
import { Controller, } from "react-hook-form"
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
//CLASS
import { CustomUploadPlugin } from "./CustomCKEditor";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
//HOOK
import useUploadMultiple from "@/hook/useUploadMultiple";
import { useFormContext } from "react-hook-form";
interface ISystemProps {
    [key: string]: any
}

interface Option {
    value: string,
    label: string
}

interface IDataSystem {
    label: string,
    keyword: string,
    content: any,
    type: string,
    options?: Option[]
}



const System = ({
    ...restProps
}: ISystemProps) => {

    const editorRef = useRef<any>(null)
    const [previousImage, setPreviousImage] = useState<string[]>([])
    const { register, formState: { errors } } = useFormContext()
    const { images, handleImageChange, deleteImage } = useUploadMultiple();

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



    const { setValue } = useFormContext();
    // useEffect để cập nhật giá trị khi `value.content` thay đổi
    useEffect(() => {
        if (restProps.data && restProps.data.length > 0) {
            restProps.data.forEach((value: any) => {
                if (value.type === "select" && value.content) {
                    setValue(`config[${value.keyword}]`, value.content);
                }
                if (value.type === "textarea" && value.content) {
                    setValue(`config[${value.keyword}]`, value.content);
                }
                if (value.type === "text" && value.content) {
                    setValue(`config[${value.keyword}]`, value.content);
                }
            });
        }
    }, [restProps.data, setValue]);

    return (
        <div className="grid grid-cols-12 gap-4 mb-[20px]">
            <div className="col-span-6">
                <div className="panel-head">
                    <div className="text-[20px] mb-[15px] font-bold text-black">{restProps.title ?? "Thông tin"}</div>
                    <div className="text-[15px] font-thin text-slate-600">
                        Cài đặt đầy đủ thông tin chung website. Tên thương hiệu website, Logo, Favicon, vv...
                    </div>
                </div>
            </div>
            <div className="col-span-6">
                <Card className="rounded-[5px] mb-[20px]">
                    <CardContent className="p-[10px]">
                        {
                            restProps.data && restProps.data.length > 0 &&
                            restProps.data.map((value: IDataSystem, index: string) => (
                                <div key={index}>
                                    {
                                        value.type === "select" ? (
                                            <>
                                                <Label htmlFor="image" className="text-right text-slate-600 font-bold">
                                                    {value.label}
                                                </Label>
                                                <Controller
                                                    name={`config[${value.keyword}]`}
                                                    render={({ field }) => (
                                                        <Select
                                                            options={value.options}
                                                            defaultValue={value.content}
                                                            className="w-[full] mt-[5px] mb-[20px]"
                                                            placeholder={value.label}
                                                            onChange={(selected) => {
                                                                // setSelectedValue(selected)
                                                                field.onChange(selected?.value)
                                                                // onSelectChange && onSelectChange(selected?.value)
                                                            }}
                                                            value={value.options?.find((option: Option) => option.value === field.value) || null}
                                                        />
                                                    )}
                                                />
                                            </>

                                        ) : value.type === "text" ? (
                                            <CustomInput
                                                label={value.label}
                                                name={`config[${value.keyword}]`}
                                                type="text"
                                                className="mb-[20px]"
                                                labelClass="text-slate-600 font-bold"
                                            />
                                        ) : value.type === "textarea" ? (
                                            <>
                                                <Label htmlFor="image" className="text-right text-slate-600 font-bold">
                                                    {value.label}
                                                </Label>
                                                <Controller
                                                    name={`config[${value.keyword}]`}
                                                    defaultValue={value.content}
                                                    render={({ field }) => (
                                                        <CKEditor
                                                            editor={ClassicEditor}
                                                            data={field.value ?? ''}
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
                                            </>
                                        ) : value.type === 'image' ?
                                            (
                                                <>
                                                    <Label htmlFor="image" className="text-right text-slate-600 font-bold">
                                                        {value.label}
                                                    </Label>
                                                    <input
                                                        type="file"
                                                        accept="image/"
                                                        id={value.keyword}
                                                        className="hidden"
                                                        {...register(`config[${value.keyword}]`, {
                                                            onChange: handleImageChange(value.keyword)
                                                        })}
                                                    />
                                                    <div className="text-center">
                                                        <label htmlFor={value.keyword}>
                                                            <Avatar className="w-[100px] h-[100px] inline-block cursor-pointer shadow-md border">
                                                                {images[value.keyword]?.length > 0 ? (
                                                                    <AvatarImage src={images[value.keyword][0].preview} />
                                                                ) : value && value.content ? (
                                                                    <AvatarImage src={value.content} />
                                                                ) : (
                                                                    <AvatarImage src='https://github.com/shadcn.png' />
                                                                )}
                                                            </Avatar>
                                                        </label>
                                                    </div>
                                                </>
                                            ) : (
                                                <div>Không có dữ liệu hiển thị</div>
                                            )
                                    }
                                </div>
                            ))
                        }
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default System