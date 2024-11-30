import React from "react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "./ui/breadcrumb"

interface PageHeadingProps {
    breadcrumb: {
        title: string,
        route: string
    }
}

import { Link } from "react-router-dom"

const PageHeading: React.FC<PageHeadingProps> = ({ breadcrumb }) => {
    return (
        <>
            <div className="page-heading py-[20px] bg-white border-b border-[#e7eaec]">
                <div className="px-[10px]">
                    <h2 className="text-[24px] mb-[5px]">{breadcrumb.title}</h2>
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link to="/dashboard">Dashboard</Link>
                            </BreadcrumbItem>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <Link to={breadcrumb.route}>{breadcrumb.title}</Link>
                            </BreadcrumbItem>
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>
        </>
    )
}

export default PageHeading