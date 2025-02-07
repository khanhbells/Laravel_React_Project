//REACT
import { useQuery } from "react-query";
//COMPONENT
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { memo, useEffect, useState } from "react";
import { LoadingSpinner } from "./ui/loading";
//SETTING
import { queryKey } from "@/constant/query";
//HELPER
import dayjs from "dayjs";
//SERVICE
import { pagination } from "@/service/MedicineService";
//TYPE
import { Medicine as TMedicine } from "@/interfaces/types/MedicineType";
//CONTEXT
import { useMedicineContext } from "@/contexts/MedicineContext";
//Redux
import { useSelector } from "react-redux"
import { RootState } from '@/redux/store'
interface MedicineProps {
    label?: string,
    [key: string]: any
}

const StoreBookingMedicine = ({
    label,
    ...restProps
}: MedicineProps) => {

    const model = 'medicines'
    const { isAuthenticated, idMedicineCatalogue: idMedicineCatalogueRedux } = useSelector((state: RootState) => state.idMedicineCatalogue)

    const { data, isLoading, isError, refetch } = useQuery(
        ['medicine_catalogue_id', idMedicineCatalogueRedux !== null && idMedicineCatalogueRedux],
        () => pagination(`perpage=20&medicine_catalogue_id=${idMedicineCatalogueRedux}`),
        {
            enabled: idMedicineCatalogueRedux !== null, // Chỉ chạy khi queryEnabled = true
        }
    );
    const [customData, setCustomData] = useState<TMedicine[]>([]);
    const { activeIndices, setActiveIndices } = useMedicineContext();

    useEffect(() => {
        if (data && !isLoading && data[model].length > 0) {

            const formatData = data[model].map((value: TMedicine) => ({
                ...value,
                publish: String(value.publish)
            }))
            setCustomData(formatData)
        }
    }, [data, isLoading])


    const handleButtonClick = (value: TMedicine) => {
        // Kiểm tra xem thuốc khám có đang bị tắt publish hay không
        if (value.publish !== '2') {
            setActiveIndices((prev) => prev.filter((item) => item.id !== value.id));
        } else {
            setActiveIndices((prev) => {
                const exists = prev.some((item) => item.id === value.id);
                return exists ? prev.filter((item) => item.id !== value.id) // Loại bỏ nếu đã tồn tại
                    : [...prev, value]; // Thêm nếu chưa tồn tại
            });
        }
    };

    // useEffect(() => {
    //     // Lọc bỏ các phần tử không còn hợp lệ trong activeIndices khi customData thay đổi
    //     setActiveIndices((prev) => prev.filter((item) => {
    //         // Kiểm tra xem item có tồn tại trong customData và có publish là '2' không
    //         return customData.some((data) => data.id === item.id && data.publish === '2');
    //     }));
    // }, [customData, setActiveIndices]);

    return (
        <>
            <Card className="rounded-[5px] mb-[20px]">
                <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                    <CardTitle className="uppercase">
                        <div className="flex justify-between">
                            <span>Chọn thuốc khám bệnh</span>
                        </div>
                    </CardTitle>
                </CardHeader>
                <CardContent className="pt-[15px]">
                    <div className="flex flex-wrap">
                        {
                            isLoading || customData === undefined ? (
                                <div className="flex items-center justify-center w-full">
                                    <LoadingSpinner className="mr-[5px]" />
                                </div>
                            ) : customData.length > 0 ? (

                                customData.map((value, index) => (
                                    value.publish === '2' && (
                                        <Button
                                            key={value.id}
                                            type="button"
                                            variant="outline"
                                            className={`px-1 py-2 m-2 ${activeIndices.some((item) => item.id === value.id) ? "bg-primary text-white" : ""}`}
                                            onClick={() => handleButtonClick(value)}
                                        >
                                            {value.name}
                                        </Button>
                                    )

                                ))
                            ) : customData.length === 0 ? (
                                <div className="text-center text-[12px] text-[#f00] italic">
                                    Vui lòng chọn loại thuốc
                                </div>
                            ) :
                                (
                                    <div className="text-center text-[12px] text-[#f00] italic">
                                        Không có dữ liệu phù hợp để hiển thị
                                    </div>
                                )
                        }
                    </div>
                </CardContent>
            </Card >
        </>
    )
}
export default memo(StoreBookingMedicine)