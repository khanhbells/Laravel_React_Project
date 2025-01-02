import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Label } from "./ui/label";
import { Controller, FieldErrors, FieldValues } from "react-hook-form"
interface CustomCKEditorProps<T extends FieldValues> {
    label: string,
    className?: string,
    name: string,
    control?: any,
    errors: FieldErrors<T>
}
const CustomCKEditor = <T extends FieldValues>({
    label,
    className,
    name,
    control,
    errors
}: CustomCKEditorProps<T>) => {

    const errorMessage = errors[name]?.message
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