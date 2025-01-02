//COMPONENT
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import Select from "react-select"
const Advance = () => {
    return (
        <>
            <Card className="rounded-[5px] mb-[20px]">
                <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                    <CardTitle className="uppercase">
                        Cấu hình nâng cao
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-[10px]">
                    <Select
                        options={[]}
                        className="w-full text-[12px] mb-[15px]"
                        placeholder="Chọn trạng thái"
                    // onChange={ }
                    // value={ }
                    // isLoading={isLoading}
                    />
                    <Select
                        options={[]}
                        className="w-full text-[12px] mb-[15px]"
                        placeholder="Chọn tình trạng index"
                    // onChange={ }
                    // value={ }
                    // isLoading={isLoading}
                    />
                </CardContent>
            </Card>
        </>
    )
}

export default Advance