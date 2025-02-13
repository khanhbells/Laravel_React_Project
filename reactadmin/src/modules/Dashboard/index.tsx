import ChartOne from "@/components/Charts/ChartOne"
import ChartThree from "@/components/Charts/ChartThree"
import Statistic from "@/components/Statistic"
import TableOne from "@/components/Tables/TableOne"
import { statistic } from "@/service/DashboardService"
import { Helmet } from "react-helmet-async"
import { useQuery } from "react-query"
import PageHeading from "../../components/heading"
import { tableColumn } from "./settings"
import ChartTwo from "@/components/Charts/ChartTwo"
import ChatCard from "@/components/Chat/ChatCard"
import CustomHelmet from "@/components/CustomHelmet"
const Dashboard = () => {
    const breadcrumb = {
        title: 'Thống kê chung',
        route: 'dashboard'
    }

    const { data, isLoading, isError, refetch } = useQuery(['statistic'], () => statistic())

    return (
        <>
            <CustomHelmet
                meta_title="Dashboard - Thống kê doanh thu"
                meta_description="Xem thống kê doanh thu và hiệu suất kinh doanh của bạn."
                meta_keyword="thống kê, doanh thu, dashboard, kinh doanh"
                canonical={breadcrumb.route}
            />
            <PageHeading breadcrumb={breadcrumb} />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5 m-[10px]">
                <Statistic
                    isLoading={isLoading}
                    data={data}
                />
            </div>
            <div className="mt-4 px-[10px] grid grid-cols-12 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5">
                <ChartOne />
                <ChartThree />
                <div className="col-span-12 xl:col-span-7">
                    <ChartTwo />
                </div>

                <TableOne
                    tableColumn={tableColumn}
                />
                {/* <ChatCard /> */}
            </div>
        </>
    )
}

export default Dashboard