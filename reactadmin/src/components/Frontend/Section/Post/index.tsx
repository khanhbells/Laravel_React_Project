import DetailContent from "@/components/DetailContent";
import Paginate from "@/components/paginate";
import { endpoint } from "@/constant/endpoint";
import useListContent from "@/hook/useListContent";
import { pagination } from "@/service/Frontend/FrontEndService";
import { useParams } from "react-router-dom";
import PageHeading from "../Breadcrumb";
const Post = () => {
    const model = 'posts'
    const { catalogueId, catalogue } = useParams()

    const query = `&publish=2&post_catalogue_id=${catalogueId}`
    const { isLoading: isLoadingPosts, data: dataPosts, isError, refetch, handlePageChange, handleQueryString } = useListContent({ model, pagination, query, endpoint: endpoint.posts })
    const breadcrumb = [
        {
            title: `${dataPosts?.posts[0].cats[0]}`,
            route: ''
        },
    ]

    return (
        <>
            <PageHeading breadcrumb={breadcrumb} />
            <DetailContent
                data={dataPosts?.posts || []}
                catalogueId={catalogueId}
                catalogue={catalogue}
                isLoading={isLoadingPosts}
                nameCatalogueParams="post"
            />
            <div className="pb-[10px]">
                {!isLoadingPosts && dataPosts[model] && dataPosts.links ? <Paginate links={dataPosts?.links} pageChange={handlePageChange} /> : null}
            </div>
        </>
    )
}

export default Post