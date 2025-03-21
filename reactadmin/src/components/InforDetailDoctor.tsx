import { memo } from "react";
import Parent from "./Parent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "./ui/loading";

export interface Option {
    value: string | undefined;
    label: string | undefined;
}

interface IInforDetailDoctor {
    dataInforDoctor: any;
    isLoadingDataInfoDoctor: boolean;
}

const InfoDetailDoctor = ({
    dataInforDoctor,
    isLoadingDataInfoDoctor,
}: IInforDetailDoctor) => {
    return (
        <>
            <Card className="rounded-[5px] mb-[20px]">
                <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                    <CardTitle className="uppercase">
                        Thông tin bác sĩ
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-[10px]">
                    {dataInforDoctor ? (
                        <>
                            <div className="mb-[10px]">
                                <img
                                    className="object-cover h-80 w-full rounded cursor-pointer"
                                    src={dataInforDoctor.image}
                                    alt=""
                                />
                            </div>

                            <div className="flex justify-between text-[15px]">
                                <label>Tên bác sĩ:</label>
                                <div className="font-bold">
                                    {dataInforDoctor.name}
                                </div>
                            </div>
                            <div className="flex justify-between text-[15px]">
                                <label>Địa chỉ phòng khám:</label>
                                <div className="font-bold">
                                    {dataInforDoctor.clinic_address}
                                </div>
                            </div>
                            <div className="flex justify-between text-[15px]">
                                <label>Tên phòng khám:</label>
                                <div className="font-bold">
                                    {dataInforDoctor.clinic_name}
                                </div>
                            </div>
                            <div className="flex justify-between text-[15px]">
                                <label>Bằng cấp:</label>
                                <div className="font-bold">
                                    {dataInforDoctor.exp}
                                </div>
                            </div>
                            <div className="flex justify-between text-[15px]">
                                <label>Chuyên khoa:</label>
                                <div className="font-bold">
                                    {dataInforDoctor.specialties
                                        .map(
                                            (specialty: any) => specialty.label
                                        )
                                        .join(", ")}
                                </div>
                            </div>
                        </>
                    ) : isLoadingDataInfoDoctor ? (
                        <div className="flex items-center justify-center w-full">
                            <LoadingSpinner className="mr-[5px]" />
                            Loading...
                        </div>
                    ) : (
                        <div className="text-[12px] text-[#f00] italic">
                            Vui lòng chọn bác sĩ
                        </div>
                    )}
                </CardContent>
            </Card>
        </>
    );
};

export default memo(InfoDetailDoctor);
