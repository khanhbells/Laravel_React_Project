import PageHeading from "@/components/heading"
import { breadcrumb } from "@/service/UserService"
import { Breadcrumb } from "@/types/Breadcrumb"
import { Input } from "@/components/ui/input"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
const UserStore = () => {

    const breadcrumbData: Breadcrumb = breadcrumb.create
    return (
        <>
            <PageHeading breadcrumb={breadcrumbData} />
            <div className="container mt-[15px]">
                <div className="grid grid-cols-2 gap-4">
                    <div className="cart-description">
                        <div className="panel-head mb-[15px] text-[20px] text-weight font-semibold text-[#1a1a1a]">
                            Thông tin chung
                        </div>
                        <div className="panel-body">
                            <p className="mb-[10px] text-[15px]">Nhập đầy đủ thông tin của người sử dụng ở biểu mẫu sau</p>
                            <p className="mb-[10px] text-[15px]">Lưu ý: Những trường đánh dấu <span className="text-[#f00000]">(*)</span> là bắt buộc</p>
                        </div>
                    </div>
                    <>
                        <Card className="rounded-[5px] mt-[15px] ">
                            <CardContent className="p-[15px]">
                                <div className="grid grid-cols-2">
                                    <div className="form-row">
                                        <div className="mb-[5px] font-semibold">Email <span className="text-[#f00000]">(*)</span></div>
                                        <Input />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </>
                </div>
            </div>
        </>
    )
}

export default UserStore