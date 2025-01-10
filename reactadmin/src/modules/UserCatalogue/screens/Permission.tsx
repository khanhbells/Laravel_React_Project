//CORE REACT
import { useMemo } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
//COMPONENT
import UserCataloguePermission from "@/components/UserCataloguePermission";
import PageHeading from "@/components/heading";
//SETTINGS
import { queryKey } from "@/constant/query";
import { breadcrumb } from "../settings/UserCatalogueSettings";
//SERVICE
import { pagination as paginationPermission } from "@/service/PermissionService";
import { pagination as paginationUserCatalogue } from "@/service/UserCatalogueService";

const Permission = ({

}) => {


    const breadcrumbData = useMemo(() => {
        const actionData = breadcrumb.permission;
        return { ...actionData };
    }, [breadcrumb]);


    // useQuery
    const { data: dataUserCatalogue, isLoading: isUserCatalogueLoading, isError: isUserCatalogueError } = useQuery([queryKey.userCatalogues], () => paginationUserCatalogue(''))
    const { data: dataPermission, isLoading: isPermissionLoading, isError: isPermissionError } = useQuery([queryKey.permissions], () => paginationPermission(''))


    return (
        <>
            <div className="page-container " >
                <PageHeading breadcrumb={breadcrumbData} />
                <div className="p-[15px]">
                    <div className="grid grid-cols-12 gap-4 ">
                        <div className="col-span-12">
                            <UserCataloguePermission
                                dataUserCatalogue={dataUserCatalogue?.user_catalogues || []}
                                dataPermission={dataPermission?.permissions || []}
                                isUserCatalogueLoading={isUserCatalogueLoading}
                                isPermissionLoading={isPermissionLoading}
                                isUserCatalogueError={isUserCatalogueError}
                                isPermissionError={isPermissionError}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Permission