import PageHeading from "../components/heading"
import { Helmet } from "react-helmet-async"
import CardDataStats from "@/components/CardDataStats"
import { useQuery } from "react-query"
import { queryKey } from "@/constant/query"
import { statistic, chart } from "@/service/DashboardService"
import { useEffect, useState } from "react"
import { FaUserDoctor } from "react-icons/fa6";
import { FaUserInjured } from "react-icons/fa6";
import { LiaFileInvoiceDollarSolid } from "react-icons/lia";
import { RiHandCoinLine } from "react-icons/ri";
import { addCommas } from "@/helper/myHelper"
import ChartOne from "@/components/Charts/ChartOne"
import ChartTwo from "@/components/Charts/ChartTwo"
import ChartThree from "@/components/Charts/ChartThree"
import TableOne from "@/components/Tables/TableOne"
import ChatCard from "@/components/Chat/ChatCard"
import { LoadingSpinner } from "@/components/ui/loading"
import { MdOutlineBorderColor } from "react-icons/md";
const Dashboard = () => {
    const breadcrumb = {
        title: 'Thống kê chung',
        route: '/dashboard'
    }
    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5173'; // Đặt base URL ở file .env
    const canonicalUrl = `${baseUrl}${breadcrumb.route}`;

    const { data, isLoading, isError, refetch } = useQuery(['statistic'], () => statistic())

    return (
        <>
            <Helmet>
                <title>Dashboard</title>
                <meta name="description" content="Thống kê doanh thu"></meta>
                <link rel="canonical" href={canonicalUrl} />
            </Helmet>
            <PageHeading breadcrumb={breadcrumb} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 m-[10px]">
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
                {
                    data?.statistic?.totalPendingBooking !== 0 &&
                    <CardDataStats
                        title="Đơn chờ xác nhận"
                        total={isLoading ? <LoadingSpinner /> : `${data?.statistic?.totalPendingBooking || 0} đơn khám`}
                        levelUp
                        classColorName="red-500"
                        route="/booking/index?status=pending"
                    >
                        <MdOutlineBorderColor className="text-[20px] text-red-400" />
                    </CardDataStats>
                }
            </div>

            <div className="mt-4 px-[10px] grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                <ChartOne />
                {/* <ChartTwo /> */}
                <ChartThree />
                <div className="col-span-12 xl:col-span-8">
                    <TableOne />
                </div>
                {/* <ChatCard /> */}
            </div>
        </>
    )
}

export default Dashboard