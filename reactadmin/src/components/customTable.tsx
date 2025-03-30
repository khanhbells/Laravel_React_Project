import React, { act, ReactNode, useEffect, useState } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"

import { Checkbox } from "./ui/checkbox"
import { Switch } from "./ui/switch"
import { Button } from "./ui/button"


import { LoadingSpinner } from "./ui/loading"

import useColumnState from "../hook/useColumnState"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "./ui/table"
import CustomAlertDialog from "@/components/CustomAlertDialog";
import useDialog from "@/hook/useDialog"
import { CustomTableProps, Row, ParamsToTuple } from "@/interfaces/BaseServiceInterface"
import { changePassword } from "@/service/UserService"
import dayjs from "dayjs"
import CustomDialog from "@/components/CustomDialog"
import { useUserContext } from "@/contexts/UserContext"


const CustomTable = ({
    data,
    isLoading,
    isError,
    model,
    tableColumn,
    checkedState,
    checkedAllState,
    handleCheckedChange,
    handleCheckedAllChange,
    openSheet,
    destroy,
    refetch,
    ...restProps
}: CustomTableProps) => {
    
    const now = dayjs();

    //CONTEXT
    const { user } = useUserContext();

    const { buttonActions } = restProps;
    const { columnState, handleChecked, setInitialColumnState } = useColumnState()
    const { confirmAction, openAlertDialog, closeAlertDialog, alertDialogOpen, isLoading: isDialogLoading } = useDialog(refetch)


    const [DialogComponent, setDialogComponent] = useState<React.ComponentType<any> | null>(null)

    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)



    const handleAlertDialog = (id: string, callback: any) => {
        openAlertDialog(id, callback)
    }

    const handleDialog = (id: string, callback: Function, Component: React.ComponentType<any>) => {
        setDialogComponent(() => (props: any) =>
            <Component
                id={id}
                callback={callback}
                {...props}
            />
        );
        setIsDialogOpen(true)
    }

    //Follow theo isLoading và data
    useEffect(() => {
        if (!isLoading && data[model]) {
            setInitialColumnState(data[model], 'publish')
        }
    }, [isLoading, data])

    return (
        <>
            <Table className="border border-solid border-[#ebebeb]">
                <TableHeader>
                    <TableRow>
                        {
                            !restProps.status &&
                            <TableHead>
                                <Checkbox
                                    id="checkAll"
                                    className="text-white"
                                    checked={checkedAllState}
                                    onCheckedChange={() => {
                                        handleCheckedAllChange()
                                    }}
                                />
                            </TableHead>
                        }
                        {tableColumn && tableColumn.map((column, index) => (
                            user?.user_catalogue_id === 1 && column.name === 'Bác sĩ' ? (
                                <TableHead key={index}>{column.name}</TableHead>
                            ) :
                                column.name !== 'Bác sĩ' &&
                                (<TableHead key={index}>{column.name}</TableHead>)

                        ))}
                        {
                            !restProps.flag && <TableHead className="text-center">Tình trạng</TableHead>
                        }
                        <TableHead className="text-center">Tác vụ</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {isLoading || data[model] === undefined ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center items-center">
                                <LoadingSpinner className="inline-block mr-[5px]" />
                                Loading...
                            </TableCell>
                        </TableRow>

                    ) : isError ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center text-[12px] text-[#f00000]">
                                Có lỗi xảy ra trong quá trình truy xuất dữ liệu. Hãy thử lại sau
                            </TableCell>
                        </TableRow>
                    ) : (data?.[model] ?? []).length > 0 ? (data[model] && data[model].map((row: any, index: number) => (
                        <TableRow
                            key={index}
                            className={`${checkedState[row.id] ? 'bg-[#ffc]' : ''} ${dayjs(`${row.date} ${row.end_time}`).isBefore(now) ? 'opacity-50' : ''}`}
                        >
                            {
                                !restProps.status &&
                                <TableCell className="font-medium">
                                    <Checkbox id="checkAll"
                                        className="text-white"
                                        checked={checkedState[row.id] || false}
                                        onCheckedChange={() => handleCheckedChange(row.id)}
                                    />
                                </TableCell>
                            }
                            {tableColumn && tableColumn.map((column, index) => (
                                user?.user_catalogue_id === 1 && column.name === 'Bác sĩ' ? (
                                    <TableCell key={index}>{column.render(row)}</TableCell>
                                ) :
                                    column.name !== 'Bác sĩ' &&
                                    (<TableCell key={index}>{column.render(row)}</TableCell>)

                            ))}
                            {
                                !restProps.flag &&
                                <TableCell className="text-center">
                                    <Switch value={row.id} checked={columnState[row.id]?.publish} onCheckedChange={() => handleChecked(row.id, 'publish', model)} />
                                </TableCell>
                            }
                            <TableCell className="flex justify-center">
                                {buttonActions && buttonActions.map((action: any, index: number) => {
                                let isExpired = false
                                if(row.date && row.end_time){
                                    const endTime = dayjs(
                                        `${row.date} ${dayjs(row.end_time).format("hh:mm A")}`
                                    );
                                     isExpired = endTime.isBefore(now);
                                }
                                    return (
                                        (
                                            action.path ? (
                                                <Link key={index} to={`${action.path}${row.id}`} className={`p-0 py-[11px] bg-primary text-white rounded ${action.className} p-[15px]`}>
                                                    {action.icon}
                                                </Link>
                                            ) : isExpired && action.method === 'update' ? (
                                                <></>
                                            ) :
                                            (
                                                <Button
                                                    key={index} className={`${action.className} p-[15px]`}
                                                    onClick={
                                                        action.onClick && action.params ? (e: React.
                                                            MouseEvent<HTMLButtonElement>) => {
                                                            const args = action.params?.map((param: any) => {
                                                                if (typeof param === 'string' && (param.endsWith(':f') || param.endsWith(':pf') || param.endsWith(':c'))) {
                                                                    if (param.endsWith(':f')) {
                                                                        return eval(param.slice(0, -2))
                                                                    } else if (param.endsWith(':pf')) {
                                                                        const functionName = param.slice(0, -3)
                                                                        return restProps[functionName]
                                                                    } else if (param.endsWith(':c')) {
                                                                        return action.component
                                                                    }
                                                                }
                                                                else {
                                                                    return row[param as keyof Row]
                                                                }
                                                            }) as ParamsToTuple<typeof action.params>
                                                            if (action.onClick) {
                                                                action.onClick(...args)
                                                            }
                                                        } : undefined
                                                    }
                                                >
                                                    {action.icon}
                                                </Button>
                                            )
                                        )
                                    )
                                })}
                            </TableCell>
                        </TableRow>
                    ))
                    ) : data === undefined ? (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center text-[12px] text-[#f00]">
                                Không có dữ liệu phù hợp để hiển thị
                            </TableCell>
                        </TableRow>
                    ) : (
                        <TableRow>
                            <TableCell colSpan={9} className="text-center text-[12px] text-[#f00]">
                                Không có dữ liệu phù hợp để hiển thị
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table >
            <CustomAlertDialog
                isOpen={alertDialogOpen}
                title="Bạn có chắc chắn muốn thực hiện chức năng này?"
                description="Hành động này là không thể đảo ngược được! Hãy chắc chắn rằng bạn muốn thực hiện chức năng này"
                closeAlertDialog={closeAlertDialog}
                confirmAction={() => confirmAction()}
                isDialogLoading={isDialogLoading}
            />
            {isDialogOpen && DialogComponent && (
                <CustomDialog
                    heading="Đổi mật khẩu"
                    description="Nhập đầy đủ thông tin dưới đây. Các mục có dấu (*) là bắt buộc"
                    buttonLoading={false}
                    open={isDialogOpen}
                    close={() => setIsDialogOpen(false)}
                >
                    <DialogComponent
                        close={() => setIsDialogOpen(false)}
                    />
                </CustomDialog>
            )}

        </>
    )
}

//endsWith: Kiểm tra chuỗi có kết thúc bằng một ký tự hoặc chuỗi ký tự cụ thể không.
//slice: Trích xuất một phần của chuỗi từ vị trí bắt đầu đến vị trí kết thúc (không bao gồm vị trí kết thúc).
//const str = "example:f";
// console.log(str.slice(0, -2)); // "example" (loại bỏ 2 ký tự cuối)
// console.log(str.slice(2, 5)); // "amp" (từ vị trí 2 đến 4)
export default CustomTable