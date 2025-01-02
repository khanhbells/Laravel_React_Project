//COMPONENT
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import UploadSvg from '@/assets/svg/upload.svg'
const Album = () => {
    return (
        <>
            <Card className="rounded-[5px] mb-[20px]">
                <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                    <CardTitle className="flex justify-between items-center">
                        <span className="uppercase">Album ảnh</span>
                        <span className="cursor-pointer text-[blue] text-[14px] font-medium">Chọn hình ảnh</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-[15px] text-center items-center p-[20px]">
                    <div className="click-to-upload border border-dashed border-1 border-[#ccced1] p-[20px] text-center cursor-pointer">
                        <div className="icon ">
                            <img src={UploadSvg} alt="Upload Icon" className="size-20 mb-2 inline-block" />
                        </div>
                        <div className="text-center text-[14px]">Sử dụng nút chọn hình hoặc click vào đây để thêm hình ảnh</div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}

export default Album