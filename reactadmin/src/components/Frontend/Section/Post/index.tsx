import DetailContent from "@/components/DetailContent";
import Paginate from "@/components/Paginate";
import { endpoint } from "@/constant/endpoint";
import useListContent from "@/hook/useListContent";
import { pagination } from "@/service/Frontend/FrontEndService";
import { useParams } from "react-router-dom";
import PageHeading from "../Breadcrumb";
import { useQuery } from "react-query";
import { getPostCatalogueById } from "@/service/PostCatalogueService";
import CustomHelmet from "@/components/CustomHelmet";
const Post = () => {
    const model = 'posts'
    const { catalogueId, catalogue } = useParams()

    const query = `&publish=2&post_catalogue_id=${catalogueId}`
    const { isLoading: isLoadingPosts, data: dataPosts, isError, refetch, handlePageChange, handleQueryString } = useListContent({ model, pagination, queryData: query, endpoint: endpoint.posts })
    const { data: dataCatalogue, isLoading, isError: isErrorDataCatalogue } = useQuery([model, catalogueId], () => getPostCatalogueById(catalogueId), {
        enabled: !!catalogueId,
    })
    const breadcrumb = [
        {
            title: `${dataPosts && dataPosts.posts.length > 0 ? dataPosts.posts[0].cats[0] : 'Loading...'}`,
            route: ''
        },
    ]

    return (
        <>
            <CustomHelmet
                meta_title={dataCatalogue?.meta_title || ''}
                meta_keyword={dataCatalogue?.meta_keyword || ''}
                meta_description={dataCatalogue?.meta_description || ''}
                canonical={`homepage/post/${catalogueId}/${catalogue}`}
            />
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