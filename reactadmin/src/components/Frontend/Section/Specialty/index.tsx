import { useParams } from "react-router-dom"
import PageHeading from "../Breadcrumb";
import { useQuery } from "react-query";
import { pagination } from "@/service/Frontend/FrontEndService";
import { endpoint } from "@/constant/endpoint";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import DetailContent from "@/components/DetailContent";
const Specialty = () => {
    const model = 'specialties'
    const { catalogueId, catalogue } = useParams()
    const { data: dataSpecialties, isLoading: isLoadingSpecialties } = useQuery(
        [model],
        () => pagination(`&publish=2&specialty_catalogue_id=${catalogueId}`, endpoint.specialties)
    );
    const breadcrumb = [
        {
            title: `${dataSpecialties?.specialties[0].cats[0]}`,
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
        </>
    )
}

export default Specialty