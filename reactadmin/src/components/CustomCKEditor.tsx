import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Label } from "./ui/label";

interface CustomCKEditorProps {
    label: string,
    className?: string
}
const CustomCKEditor = ({
    label,
    className
}: CustomCKEditorProps) => {
    return (
        <>
            <div className={`gap-4 ${className ?? null}`}>
                <Label className="mb-[10px] block mt-[10px]">
                    {label}
                </Label>
                <CKEditor
                    editor={ClassicEditor}
                    data=""
                    onChange={(event, editor) => {
                        const data = editor.getData();
                        console.log(data);
                    }}
                />
            </div>
        </>
    )
}

export default CustomCKEditor