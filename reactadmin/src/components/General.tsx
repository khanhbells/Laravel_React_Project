//COMPONENT
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import CustomCKEditor from "@/components/CustomCKEditor";
import CustomInput from "./CustomInput";
import { useEffect, useRef, memo } from "react";


interface GeneralProps {
    label?: string
}

const General = ({
    label
}: GeneralProps) => {

    return (
        <>
            <Card className="rounded-[5px] mb-[20px]">
                <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                    <CardTitle className="uppercase">Thông tin chung</CardTitle>
                </CardHeader>
                <CardContent className="pt-[15px]">
                    <CustomInput
                        label={label ? label : "Tên bài viết"}
                        name="name"
                        type="text"
                        value=""
                        className="gap-4"
                        labelClassName="mb-[10px] block"
                        required={true}
                    />
                    <CustomCKEditor
                        label="Mô tả ngắn"
                        className="ckeditor-description mb-[20px] mt-[20px]"
                        name="description"
                    />
                    <CustomCKEditor
                        label="Nội dung"
                        className="ckeditor-content"
                        name="content"
                    />
                </CardContent>
            </Card>
        </>
    )
}
export default memo(General)