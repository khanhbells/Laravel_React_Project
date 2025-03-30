import CardDataStats from "@/components/CardDataStats"
import { LoadingSpinner } from "@/components/ui/loading"
import { RiHandCoinLine } from "react-icons/ri";
import { FaUserDoctor } from "react-icons/fa6";
import { FaUserInjured } from "react-icons/fa6";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { MdOutlineBorderColor } from "react-icons/md";
import { addCommas } from "@/helper/myHelper"

interface StatisticProps {
    isLoading: boolean,
    data: any
}

const Statistic = ({
    isLoading,
    data
}: StatisticProps) => {
    return (
        <>
            <CardDataStats
                title="Tổng Doanh thu"
                total={isLoading ? <LoadingSpinner /> : `${addCommas(data?.statistic?.revenueAll) || 0} VNĐ`}
                classColorName="orange-500"
            >
                <RiHandCoinLine className="text-[20px] text-yellow-500" />
            </CardDataStats>
            <CardDataStats
                title="Tổng bác sĩ"
                total={isLoading ? <LoadingSpinner /> : `${data?.statistic?.totalDoctor || 0} bác sĩ`}
                classColorName="sky-500"
            >
                <FaUserDoctor className="text-[20px] text-sky-600" />
            </CardDataStats>
            <CardDataStats
                title="Tổng bệnh nhân"
                total={isLoading ? <LoadingSpinner /> : `${data?.statistic?.totalPatient || 0} bệnh nhân`}
                classColorName="teal-500"
            >
                <FaUserInjured className="text-[20px] text-teal-600" />
            </CardDataStats>
            <CardDataStats
                title="Tổng số đơn khám"
                total={isLoading ? <LoadingSpinner /> : `${data?.statistic?.totalBooking || 0} đơn khám`}
                levelUp
                previousMonth="so với tháng trước"
                classColorName="violet-500"
            >
                <LiaFileInvoiceDollarSolid className="text-[20px] text-violet-600" />
            </CardDataStats>
            <CardDataStats
                title="Tổng số đơn được xác nhận"
                total={isLoading ? <LoadingSpinner /> : `${data?.statistic?.totalConfirmBooking || 0} đơn khám`}
                levelUp
                previousMonth="so với tháng trước"
                classColorName="green-500"
            >
                <LiaFileInvoiceDollarSolid className="text-[20px] text-green-600" />
            </CardDataStats>
            <CardDataStats
                title="Tổng số đơn bị hủy"
                total={isLoading ? <LoadingSpinner /> : `${data?.statistic?.totalStopBooking || 0} đơn khám`}
                levelUp
                previousMonth="so với tháng trước"
                classColorName="red-500"
            >
                <LiaFileInvoiceDollarSolid className="text-[20px] text-red-600" />
            </CardDataStats>
            {
                data?.statistic?.totalPendingBooking !== 0 &&
                <CardDataStats
                    title="Đơn chờ xác nhận"
                    total={isLoading ? <LoadingSpinner /> : `${data?.statistic?.totalPendingBooking || 0} đơn khám`}
                    levelUp
                    classColorName="yellow-500"
                    route="/booking/index?status=pending"
                >
                    <MdOutlineBorderColor className="text-[20px] text-yellow-400" />
                </CardDataStats>
            }
        </>
    )
}

export default Statistic