import React from "react"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { FaHome } from "react-icons/fa";

interface PageHeadingProps {
    breadcrumb: {
        title: string,
        route: string
    }[]
}

import { Link } from "react-router-dom"

const PageHeading: React.FC<PageHeadingProps> = ({ breadcrumb }) => {
    return (
        <>
            <div className="page-heading py-[20px] bg-white border-b border-[#e7eaec] px-[100px]">
                <div className="px-[10px]">
                    <Breadcrumb>
                        <BreadcrumbList>
                            <BreadcrumbItem>
                                <Link to="/homepage" className="flex"><FaHome className="mt-[2px] mr-[5px]" /> Home</Link>
                            </BreadcrumbItem>
                            {
                                breadcrumb && breadcrumb.map((value, index) => (
                                    <React.Fragment key={index}>
                                        <BreadcrumbSeparator />
                                        <BreadcrumbItem>
                                            <Link to={value.route}>{value.title}</Link>
                                        </BreadcrumbItem>
                                    </React.Fragment>
                                ))
                            }
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
            </div>
        </>
    )
}

export default PageHeading