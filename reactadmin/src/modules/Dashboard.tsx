import PageHeading from "../components/heading"
import { Helmet } from "react-helmet-async"

const Dashboard = () => {
    const breadcrumb = {
        title: 'Thống kê chung',
        route: '/dashboard'
    }
    const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5173'; // Đặt base URL ở file .env
    const canonicalUrl = `${baseUrl}${breadcrumb.route}`;

    return (
        <>
            <Helmet>
                <title>Dashboard</title>
                <meta name="description" content="Thống kê doanh thu"></meta>
                <link rel="canonical" href={canonicalUrl} />
            </Helmet>
            <PageHeading breadcrumb={breadcrumb} />
        </>
    )
}

export default Dashboard