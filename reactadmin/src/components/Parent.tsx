//COMPONENT
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Select from "react-select"
const Parent = () => {
    return (
        <>
            <Card className="rounded-[5px] mb-[20px]">
                <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                    <CardTitle className="uppercase">
                        Danh mục cha
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-[10px]">
                    <span className="text-[#f00] text-[12px] mb-[10px] block">*Chọn Root nếu không có danh mục cha</span>
                    <Select
                        options={[]}
                        className="w-full text-[12px]"
                        placeholder="Chọn danh mục cha"
                    // onChange={ }
                    // value={ }
                    // isLoading={isLoading}
                    />
                </CardContent>
            </Card>
        </>
    )
}

export default Parent