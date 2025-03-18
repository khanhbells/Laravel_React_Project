import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { addCommas } from "@/helper/myHelper";
import CardDataStats from "./CardDataStats";
import { LoadingSpinner } from "./ui/loading";
import { RiHandCoinLine } from "react-icons/ri";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { MdOutlineBorderColor } from "react-icons/md";
import { memo } from "react";

interface IDetailAnalytics {
    data: any;
    isLoading: boolean;
}

const DetailAnalytics = ({ data, isLoading }: IDetailAnalytics) => {
    return (
        <>
            <div className="col-span-8">
                <Card>
                    <CardContent>
                        <Table className="border border-solid border-[#ebebeb] mt-[20px]">
                            <TableHeader>
                                <TableRow className="">
                                    <TableHead className="text-center font-bold">
                                        Ngày đặt lịch
                                    </TableHead>
                                    <TableHead className="text-center font-bold">
                                        Doanh thu
                                    </TableHead>
                                    <TableHead className="text-center font-bold">
                                        Số đơn khám được duyệt
                                    </TableHead>
                                    <TableHead className="text-center font-bold">
                                        Số đơn khám chờ xác nhận
                                    </TableHead>
                                    <TableHead className="text-center font-bold">
                                        Số đơn khám bị hủy
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {data &&
                                data?.listRevenueDetailDoctor.length > 0 ? (
                                    data?.listRevenueDetailDoctor.map(
                                        (value: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell className="text-center">
                                                    {value.examinationDate}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {addCommas(value.revenue)}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {value.totalBookingSuccess}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {value.totalBookingPending}
                                                </TableCell>
                                                <TableCell className="text-center">
                                                    {value.totalBookingStop}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )
                                ) : data?.listRevenueDetailDoctor.length ===
                                  0 ? (
                                    <TableRow>
                                        <TableCell className="text-[12px] text-[#f00] italic">
                                            Bác sĩ chưa có thu nhập
                                        </TableCell>
                                    </TableRow>
                                ) : isLoading ? (
                                    <TableRow>
                                        <TableCell className="flex">
                                            <LoadingSpinner className="mr-[5px]" />{" "}
                                            Loading...
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    <TableRow>
                                        <TableCell className="text-[12px] text-[#f00] italic">
                                            Vui lòng chọn bác sĩ
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                    <div className="px-[25px] pb-[20px]">
                        <div className="mb-[10px]">
                            <CardDataStats
                                title="Tổng doanh thu bác sĩ"
                                total={
                                    <div className="flex">
                                        {data?.totalRevenue ? (
                                            <div className="mr-[5px]">
                                                {addCommas(data.totalRevenue)}
                                            </div>
                                        ) : isLoading ? (
                                            <LoadingSpinner className="mr-[5px]" />
                                        ) : (
                                            <div className="mr-[5px]">0</div>
                                        )}{" "}
                                        <div>VND</div>
                                    </div>
                                }
                                classColorName="orange-500"
                            >
                                <RiHandCoinLine className="text-[20px] text-yellow-500" />
                            </CardDataStats>
                        </div>
                        <div className="flex justify-between">
                            <CardDataStats
                                title="Tổng số đơn khám bác sĩ"
                                total={
                                    <div className="flex">
                                        {data?.totalBooking ? (
                                            <div className="mr-[5px]">
                                                {addCommas(data.totalBooking)}
                                            </div>
                                        ) : isLoading ? (
                                            <LoadingSpinner className="mr-[5px]" />
                                        ) : (
                                            <div className="mr-[5px]">0</div>
                                        )}{" "}
                                        <div>đơn khám</div>
                                    </div>
                                }
                                levelUp
                                previousMonth="so với tháng trước"
                                classColorName="violet-500"
                            >
                                <LiaFileInvoiceDollarSolid className="text-[20px] text-violet-600" />
                            </CardDataStats>
                            <CardDataStats
                                title="Số đơn được duyệt"
                                total={
                                    <div className="flex">
                                        {data?.totalBookingConfirm ? (
                                            <div className="mr-[5px]">
                                                {addCommas(
                                                    data.totalBookingConfirm
                                                )}
                                            </div>
                                        ) : isLoading ? (
                                            <LoadingSpinner className="mr-[5px]" />
                                        ) : (
                                            <div className="mr-[5px]">0</div>
                                        )}{" "}
                                        <div>đơn khám</div>
                                    </div>
                                }
                                levelUp
                                previousMonth="so với tháng trước"
                                classColorName="teal-500"
                            >
                                <LiaFileInvoiceDollarSolid className="text-[20px] text-teal-600" />
                            </CardDataStats>
                            <CardDataStats
                                title="Số đơn bị hủy"
                                total={
                                    <div className="flex">
                                        {data?.totalBookingStop ? (
                                            <div className="mr-[5px]">
                                                {addCommas(
                                                    data.totalBookingStop
                                                )}
                                            </div>
                                        ) : isLoading ? (
                                            <LoadingSpinner className="mr-[5px]" />
                                        ) : (
                                            <div className="mr-[5px]">0</div>
                                        )}{" "}
                                        <div>đơn khám</div>
                                    </div>
                                }
                                levelUp
                                classColorName="red-500"
                                route="/booking/index?status=pending"
                            >
                                <MdOutlineBorderColor className="text-[20px] text-red-400" />
                            </CardDataStats>
                        </div>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default memo(DetailAnalytics);
