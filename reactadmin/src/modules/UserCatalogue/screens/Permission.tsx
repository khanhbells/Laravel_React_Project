//CORE REACT
import { useEffect, useMemo } from "react";
import { useQuery } from "react-query";
import { useNavigate } from "react-router-dom";
//COMPONENT
import UserCataloguePermission from "@/components/UserCataloguePermission";
import PageHeading from "@/components/heading";
import { CardFooter } from "@/components/ui/card";
import Paginate from "@/components/Paginate";
//SETTINGS
import { queryKey } from "@/constant/query";
import { breadcrumb } from "../settings/UserCatalogueSettings";
//SERVICE
import { pagination } from "@/service/PermissionService";
import { pagination as paginationUserCatalogue } from "@/service/UserCatalogueService";
//HOOK
import useTable from "@/hook/useTable";

const Permission = ({

}) => {

    const model = 'permissions'

    const breadcrumbData = useMemo(() => {
        const actionData = breadcrumb.permission;
        return { ...actionData };
    }, [breadcrumb]);
    //REACT QUERY
    const { isLoading: isPermissionLoading, data: dataPermission, isError: isPermissionError, refetch, handlePageChange, handleQueryString } = useTable({ model, pagination })

    // useQuery
    const { data: dataUserCatalogue, isLoading: isUserCatalogueLoading, isError: isUserCatalogueError } = useQuery([queryKey.userCatalogues], () => paginationUserCatalogue(''))
    // const { data: dataPermission, isLoading: isPermissionLoading, isError: isPermissionError } = useQuery([queryKey.permissions], () => pagination(''))

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
                            <CardFooter>
                                {!isPermissionLoading && dataPermission && dataPermission.links ? <Paginate links={dataPermission?.links} pageChange={handlePageChange} /> : null}
                            </CardFooter>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Permission