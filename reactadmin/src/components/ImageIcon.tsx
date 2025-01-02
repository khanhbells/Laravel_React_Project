//COMPONENT
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
                        <div className="flex flex-col items-center bg-gray-100 p-4 rounded-md shadow-inner">
                            <label htmlFor="image" className="size-25 flex -items-center justify-center bg-gray-200 rounded-full cursor-pointer overflow-hidden relative">
                                <input type="file" id="image" className="opacity-0 size-full absolute inset-0 cursor-pointer" />
                                <img src={UploadIcon} alt="" />
                            </label>
                            <span className="text-gray-700 font-medium text-[13px] mt-[5px]">Ảnh đại diện</span>
                        </div>
                        <div className="flex flex-col items-center bg-gray-100 p-4 rounded-md shadow-inner">
                            <label htmlFor="image" className="size-25 flex -items-center justify-center bg-gray-200 rounded-full cursor-pointer overflow-hidden relative">
                                <input type="file" id="image" className="opacity-0 size-full absolute inset-0 cursor-pointer" />
                                <img src={UploadIcon} alt="" />
                            </label>
                            <span className="text-gray-700 font-medium text-[13px] mt-[5px]">Icon</span>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default ImageIcon