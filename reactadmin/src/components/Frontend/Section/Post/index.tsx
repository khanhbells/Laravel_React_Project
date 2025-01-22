import { useParams } from "react-router-dom"
import PageHeading from "../Breadcrumb";
import { useQuery } from "react-query";
import { pagination } from "@/service/Frontend/FrontEndService";
import { endpoint } from "@/constant/endpoint";
import DetailContent from "@/components/DetailContent";
import { useEffect } from "react";
const Post = () => {
    const model = 'posts'
    const { catalogueId, catalogue } = useParams()
    const { data, isLoading } = useQuery(
        [model],
        () => pagination(`&publish=2&post_catalogue_id=${catalogueId}`, endpoint.posts)
    );
    const breadcrumb = [
        {
            title: `${data?.posts[0].cats[0]}`,
            route: ''
        },
    ]

    return (
        <>
            <PageHeading breadcrumb={breadcrumb} />
            <DetailContent
                data={data?.posts || []}
                catalogueId={catalogueId}
                catalogue={catalogue}
                isLoading={isLoading}
                nameCatalogueParams="post"
            />
        </>
    )
}

export default Post