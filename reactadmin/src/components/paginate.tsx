import React from "react";
import { Link } from "react-router-dom";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"

interface PaginationLink {
    url: string | null,
    label: string,
    active: boolean
}
interface PaginationProps {
    links: PaginationLink[],
    pageChange: (page: number | null) => void
}

const Paginate: React.FC<PaginationProps> = ({ links, pageChange }) => {

    const activeLinkIndex = links.findIndex(link => link.active)


    const filterLinks = links.filter((link, index) => (
        (index !== 0 && //previous link
            index !== links.length - 1) && //next link
        (index >= activeLinkIndex - 3 && index <= activeLinkIndex + 3)
    ))

    const handlePageChange = (page: number) => {
        pageChange(page);
    }


    return (
        <>
            <Pagination>
                <PaginationContent>
                    {activeLinkIndex > 1 && (
                        <PaginationItem>
                            <PaginationPrevious href="#" onClick={(e: any) => {
                                e.preventDefault()
                                handlePageChange(parseInt(links[activeLinkIndex - 1].label))
                            }}
                                className="cursor-pointer"
                            />
                        </PaginationItem>
                    )}
                    {filterLinks.map((link, index) => (
                        <PaginationItem key={index} className={link.active ? 'bg-primary rounded text-white' : null}>
                            {
                                link.url ? (
                                    <PaginationLink href="#" onClick={(e: any) => {
                                        e.preventDefault()
                                        handlePageChange(parseInt(link.label))
                                    }}>{link.label}</PaginationLink>
                                ) : null
                            }
                        </PaginationItem>

                    ))}
                    {
                        activeLinkIndex < links.length - 1 && (
                            <PaginationItem>
                                <PaginationNext onClick={(e: any) => {
                                    e.preventDefault()
                                    handlePageChange(parseInt(links[activeLinkIndex + 1].label))
                                }}
                                    className="cursor-pointer"
                                />
                            </PaginationItem>
                        )
                    }
                </PaginationContent>
            </Pagination>
        </>
    )
}
export default Paginate