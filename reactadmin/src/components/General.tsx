//COMPONENT
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import CustomCKEditor from "@/components/CustomCKEditor";
import CustomInput from "./CustomInput";
//INTERFACE
import { UseFormRegister, FieldValues, FieldErrors } from "react-hook-form";
import { PostCataloguePayloadInput } from "@/interfaces/types/PostCatalogueType";

interface GeneralProps<T extends FieldValues> {
    register: UseFormRegister<T>,
    errors: FieldErrors<T>,
    data?: PostCataloguePayloadInput,
    control: any
}

const General = <T extends FieldValues>({
    register,
    errors,
    data,
    control
}: GeneralProps<T>) => {

    return (
        <>
            <Card className="rounded-[5px] mb-[20px]">
                <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                    <CardTitle className="uppercase">Thông tin chung</CardTitle>
                </CardHeader>
                <CardContent className="pt-[15px]">
                    <CustomInput
                        register={register}
                        errors={errors}
                        label="Tiêu đề nhóm bài viết"
                        name="name"
                        type="text"
                        value={data && data.name}
                        className="gap-4"
                        labelClassName="mb-[10px] block"
                        required={true}
                    />
                    <CustomCKEditor
                        label="Mô tả ngắn"
                        className="ckeditor-description mb-[20px] mt-[20px]"
                        name="description"
                        control={control}
                        errors={errors}
                    />
                    <CustomCKEditor
                        label="Nội dung"
                        className="ckeditor-content"
                        name="content"
                        control={control}
                        errors={errors}
                    />
                </CardContent>
            </Card>
        </>
    )
}
export default General