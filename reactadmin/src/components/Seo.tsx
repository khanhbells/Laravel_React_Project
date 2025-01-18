//REACT
import { useEffect, useState, memo, useRef, useCallback } from "react";
//COMPONENT
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import CustomInput from "./CustomInput";
import CustomTextarea from "@/components/CustomTextarea";
import Canonical from "./Canonical";
//REACT
import { FieldValues } from "react-hook-form";
import { PostCatalogue } from "@/interfaces/types/PostCatalogueType";
//HELPERS
import { slug, removeHtmlTags } from "@/helper/myHelper";

interface SeoProps<T extends FieldValues> {
    data?: PostCatalogue
}

const Seo = <T extends FieldValues>({
    data
}: SeoProps<T>) => {

    const [seo, setSeo] = useState<{ canonical: string, metaTitle: string, metaDescription: string }>({
        canonical: 'http://nhap-vao-duong-dan-cua-ban.html',
        metaTitle: 'Bạn chưa nhập vào tiêu đề SEO',
        metaDescription: 'Bạn chưa nhập vào tiêu đề SEO',
    })

    const handleSeoChange = useCallback((e: any, field: string) => {
        setSeo(prevState => ({
            ...prevState,
            [field]: field === 'canonical' ? `${import.meta.env.VITE_BASE_URL}/${slug(e.target.value)}${import.meta.env.VITE_SUFFIX}` : e.target.value
        }))
    }, [])

    useEffect(() => {
        if (data) {
            setSeo({
                canonical: `${import.meta.env.VITE_BASE_URL}/${data.canonical && slug(data.canonical)}${import.meta.env.VITE_SUFFIX}`,
                metaTitle: data.meta_title && data.meta_title !== '' && removeHtmlTags(data.meta_title) || '',
                metaDescription: data.meta_description && data.meta_description !== '' && removeHtmlTags(data.meta_description) || ''
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
                        label="Từ khóa SEO"
                        name="meta_keyword"
                        type="text"
                        value=""
                        className="gap-4"
                        labelClassName="mt-[15px] mb-[10px] block"

                    // required={true}
                    />
                    <CustomTextarea
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
                    <Canonical
                        onSeoChange={handleSeoChange}
                    />

                </CardContent>
            </Card>
        </>
    )
}

export default memo(Seo)