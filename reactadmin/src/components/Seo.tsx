//REACT
import { useEffect, useState } from "react";
//COMPONENT
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import CustomInput from "./CustomInput";
import CustomTextarea from "@/components/CustomTextarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
//REACT
import { FieldValues, Path, useFormContext } from "react-hook-form";
import { PostCatalogue } from "@/interfaces/types/PostCatalogueType";
//HELPERS
import { slug, removeHtmlTags } from "@/helper/myHelper";

interface SeoProps<T extends FieldValues> {
    data?: PostCatalogue
}

const Seo = <T extends FieldValues>({
    data
}: SeoProps<T>) => {

    const { register, formState: { errors }, control } = useFormContext()

    const canonicalErrorMessage = errors['canonical']?.message

    const [seo, setSeo] = useState<{ canonical: string, metaTitle: string, metaDescription: string }>({
        canonical: 'http://nhap-vao-duong-dan-cua-ban.html',
        metaTitle: 'Bạn chưa nhập vào tiêu đề SEO',
        metaDescription: 'Bạn chưa nhập vào tiêu đề SEO',
    })

    const handleSeoChange = (e: any, field: string) => {
        setSeo(prevState => ({
            ...prevState,
            [field]: field === 'canonical' ? `${import.meta.env.VITE_BASE_URL}/${slug(e.target.value)}${import.meta.env.VITE_SUFFIX}` : e.target.value
        }))
    }

    useEffect(() => {
        if (data) {
            setSeo({
                canonical: `${import.meta.env.VITE_BASE_URL}/${slug(data.canonical)}${import.meta.env.VITE_SUFFIX}`,
                metaTitle: data.meta_title !== '' && removeHtmlTags(data.meta_title) || '',
                metaDescription: data.meta_description !== '' && removeHtmlTags(data.meta_description) || ''
            })
        }
    }, [data])
    return (
        <>
            <Card className="rounded-[5px] mt-[15px]">
                <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                    <CardTitle className="uppercase">Cấu hình SEO</CardTitle>
                </CardHeader>
                <CardContent className="pt-[15px]">
                    <div className="seo-preview mb-[40px]">
                        <div className="text-[20px] text-[#1a0dab] mb-[5px]">{seo.metaTitle.length ? seo.metaTitle : 'Bạn chưa nhập vào tiêu đề SEO'}</div>
                        <div className="text-[14px] text-[green] mb-[5px]">{seo.canonical.length ? seo.canonical : 'http://nhap-vao-duong-dan-cua-ban.html'}</div>
                        <div className="text-[14px] text-[#33]">{seo.metaDescription.length ? seo.metaDescription : 'Bạn chưa nhập vào mô tả SEO'}</div>
                    </div>
                    <CustomInput
                        register={register}
                        errors={errors}
                        label="Tiêu đề SEO"
                        name="meta_title"
                        type="text"
                        value=""
                        className="gap-4"
                        labelClassName="mb-[10px] block"
                        onChange={(e: any) => handleSeoChange(e, 'metaTitle')}
                    // required={true}
                    />
                    <CustomInput
                        register={register}
                        errors={errors}
                        label="Từ khóa SEO"
                        name="meta_keyword"
                        type="text"
                        value=""
                        className="gap-4"
                        labelClassName="mt-[15px] mb-[10px] block"

                    // required={true}
                    />
                    <CustomTextarea
                        register={register}
                        errors={errors}
                        label="Mô tả SEO"
                        name="meta_description"
                        type="text"
                        value=""
                        className="gap-4 mb-[20px]"
                        labelClassName="mt-[15px] mb-[10px] block"
                        // required={true}
                        inputClassName="min-h-[100px] border-[#ccced1]"
                        onChange={(e: any) => handleSeoChange(e, 'metaDescription')}

                    />
                    <div className="gap-4">
                        <Label className="block mb-[10px]" htmlFor="canonical">
                            Đường dẫn <span className="text-[#f00]">(*)</span>
                        </Label>
                        <div className="input-wrapper relative flex items-center">
                            <span className="h-[36px] leading-[34px] inline-block px-[10px] left-0 top-0 border-[#c4cdd5]
                                                bg-gradient-to-b from-white to-[#f9fafb] border
                                                ">https://localhost:5173</span>
                            <Input
                                type="text"
                                id="canonical"
                                className="col-span-3 focus-visible:ring-0 focus:outline-none focus:border-sky-500 focus:ring-0 border-[#ccced1] text-[blue] font-bold flex-1
                                                    border-l-0 rounded-none
                                                    "
                                {...register("canonical" as Path<T>)}
                                defaultValue=""
                                onChange={(e: any) => handleSeoChange(e, 'canonical')}
                            />
                        </div>
                        {
                            canonicalErrorMessage &&
                            <div className="error-line text-right " >
                                {typeof canonicalErrorMessage === 'string' && (
                                    <span className="text-red-500 text-xs">{canonicalErrorMessage}</span>
                                )}
                            </div>
                        }
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default Seo