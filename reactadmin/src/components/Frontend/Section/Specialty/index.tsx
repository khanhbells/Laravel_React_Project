import DetailContent from "@/components/DetailContent";
import Paginate from "@/components/Paginate";
import { endpoint } from "@/constant/endpoint";
import useListContent from "@/hook/useListContent";
import { pagination } from "@/service/Frontend/FrontEndService";
import { useParams } from "react-router-dom";
import PageHeading from "../Breadcrumb";
const Specialty = () => {
    const model = 'specialties'
    const { catalogueId, catalogue } = useParams()
    const query = `&publish=2&specialty_catalogue_id=${catalogueId}`
    const { isLoading: isLoadingSpecialties, data: dataSpecialties, isError, refetch, handlePageChange, handleQueryString } = useListContent({ model, pagination, query, endpoint: endpoint.specialties })
    const breadcrumb = [
        {
            title: `${dataSpecialties ? dataSpecialties.specialties[0].cats[0] : 'Loading...'}`,
            route: ''
        },
    ]

    return (
        <>
            <PageHeading breadcrumb={breadcrumb} />
            <DetailContent
                data={dataSpecialties?.specialties || []}
                catalogueId={catalogueId}
                catalogue={catalogue}
                isLoading={isLoadingSpecialties}
                nameCatalogueParams="specialty"
            />
            <div className="pb-[10px]">
                {!isLoadingSpecialties && dataSpecialties[model] && dataSpecialties.links ? <Paginate links={dataSpecialties?.links} pageChange={handlePageChange} /> : null}
            </div>
        </>
    )
}

export default Specialty