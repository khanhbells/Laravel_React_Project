import React from "react";
import { Link } from "react-router-dom";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
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
    links: PaginationLink[]
}

const Paginate: React.FC<PaginationProps> = ({ links }) => {

    const activeLinkIndex = links.findIndex(link => link.active)


    const filterLinks = links.filter((link, index) => (
        (index !== 0 && //previous link
            index !== links.length - 1) && //next link
        (index >= activeLinkIndex - 3 && index <= activeLinkIndex + 3)
    ))
    console.log(filterLinks);


    return (
        <>
            <Pagination>
                <PaginationContent>
                    {activeLinkIndex > 1 && (
                        <PaginationItem>
                            <PaginationPrevious href="#" />
                        </PaginationItem>
                    )}
                    {filterLinks.map((link, index) => (
                        <PaginationItem key={index} className={link.active ? 'bg-primary rounded text-white' : null}>
                            {
                                link.url ? (
                                    <PaginationLink href="#">{link.label}</PaginationLink>
                                ) : null
                            }

                        </PaginationItem>

                    ))}
                    {
                        activeLinkIndex < links.length - 1 && (
                            <PaginationItem>
                                <PaginationNext href="#" />
                            </PaginationItem>
                        )
                    }

                </PaginationContent>
            </Pagination>
        </>
    )
}
export default Paginate