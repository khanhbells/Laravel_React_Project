//REACT
import { FieldValues, useFormContext, Controller } from "react-hook-form";
//COMPONENT
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import CustomUploadBox from "./CustomUploadBox";
//IMAGE
import UploadIcon from "@/assets/upload-image.jpg";


const ImageIcon = () => {


    return (
        <>
            <Card className="rounded-[5px] mb-[20px]">
                <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                    <CardTitle className="uppercase">
                        Ảnh & Icon
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-[10px]">
                    <div className="grid grid-cols-2 gap-4">
                        <CustomUploadBox
                            name="image"
                            label="Ảnh đại diện"
                        />
                        <CustomUploadBox
                            name="icon"
                            label="Icon"
                        />
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default ImageIcon