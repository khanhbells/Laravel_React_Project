//REACT
import { memo, useState, useEffect } from "react"
//COMPONENT
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table"
import { Switch } from "./ui/switch"
import { LoadingSpinner } from "./ui/loading"
//TYPE
import { TPermission } from "@/interfaces/types/PermissionType"
import { UserCatalogue } from "@/interfaces/types/UserCatalogueType"
//API
import { updatePermission } from "@/service/BaseService"

interface IPermissionProps {
    dataUserCatalogue?: UserCatalogue[],
    dataPermission?: TPermission[],
    isUserCatalogueLoading?: boolean,
    isPermissionLoading?: boolean,
    isUserCatalogueError?: boolean,
    isPermissionError?: boolean,
}

const UserCataloguePermission = ({
    dataUserCatalogue,
    dataPermission,
    isUserCatalogueLoading,
    isPermissionLoading,
    isUserCatalogueError,
    isPermissionError,
}: IPermissionProps) => {

    const [permissions, setPermissions] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        if (dataUserCatalogue && dataPermission) {
            const initialPermissions: { [key: string]: boolean } = {};
            dataUserCatalogue.forEach((userCatalogue) => {
                userCatalogue.user_catalogue_permissions?.forEach((permissionId) => {
                    initialPermissions[`${userCatalogue.id}_${permissionId}`] = true;
                });
            });
            console.log(initialPermissions);

            setPermissions(initialPermissions);
        }
    }, [dataUserCatalogue, dataPermission]);

    const handleChecked = async (userCatalogueId: number, permissionId: number) => {
        const key = `${userCatalogueId}_${permissionId}`;
        const newState = !permissions[key];
        setPermissions((prev) => {
            const updatedPermissions = {
                ...prev,
                [key]: newState,
            };
            // Gửi toàn bộ trạng thái đã cập nhật đến API
            updatePermission(userCatalogueId, permissionId, newState);

            return updatedPermissions;
        });
    };
    return (
        <Card className="rounded-[5px] mb-[20px]">
            <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                <CardTitle className="uppercase">Cấp quyền</CardTitle>
            </CardHeader>
            <CardContent className="pt-[15px]">
                <Table className="border border-solid border-[#ebebeb]">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-center">Tên quyền</TableHead>
                            {
                                dataUserCatalogue && dataUserCatalogue.map((item, index) => (
                                    <TableHead key={index} className="text-center">{item.name}</TableHead>
                                ))
                            }
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            isUserCatalogueLoading || isPermissionLoading ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center items-center">
                                        <LoadingSpinner className="inline-block mr-[5px]" />
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : isUserCatalogueError || isPermissionError ? (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center items-center">
                                        <span className="text-[#f00]">Có lỗi xảy ra</span>
                                    </TableCell>
                                </TableRow>
                            ) : dataPermission && dataPermission.length > 0 ? (
                                dataPermission.map((item, index) => (
                                    <TableRow key={index}>
                                        <TableCell
                                            className="flex justify-between"
                                        >
                                            <a href="">{item.name}</a>
                                            <span className="text-[#f00]">{item.canonical}</span>
                                        </TableCell>
                                        {
                                            dataUserCatalogue && dataUserCatalogue.map((userCatalogue, index) => (
                                                <TableCell key={index} className="text-center">
                                                    <Switch
                                                        value={userCatalogue.id}
                                                        checked={permissions[`${userCatalogue.id}_${item.id}`] || false}
                                                        onCheckedChange={() => { handleChecked(userCatalogue.id, item.id) }}
                                                    />
                                                </TableCell>
                                            ))
                                        }
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={9} className="text-center text-[12px] text-[#f00]">
                                        Không có dữ liệu phù hợp để hiển thị
                                    </TableCell>
                                </TableRow>
                            )}
                    </TableBody>
                </Table >
            </CardContent>
        </Card>
    )
}

export default memo(UserCataloguePermission)