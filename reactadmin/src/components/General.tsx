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
import { PostCatalogue } from "@/interfaces/types/PostCatalogueType";
import { useFormContext } from "react-hook-form";


interface GeneralProps<T extends FieldValues> {
    data?: PostCatalogue,
}

const General = <T extends FieldValues>({
    data,
}: GeneralProps<T>) => {

    const { register, formState: { errors }, control } = useFormContext()

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
export default General