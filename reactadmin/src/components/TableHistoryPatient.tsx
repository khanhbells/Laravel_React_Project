import React, { useEffect, useState } from "react"

import { Checkbox } from "../components/ui/checkbox"
import { Switch } from "../components/ui/switch"

import { LoadingSpinner } from "../components/ui/loading"

import useColumnState from "../hook/useColumnState"

import useDialog from "@/hook/useDialog"
import { CustomTableProps, Row, ParamsToTuple } from "@/interfaces/BaseServiceInterface"
import dayjs from "dayjs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table"
import { Button } from "./ui/button"
import CustomAlertDialog from "./CustomAlertDialog"


const TableHistoryPatient = ({
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
    stopBooking,
    refetch,
    ...restProps
}: CustomTableProps) => {

    // useEffect(() => {
    //     console.log(data);
    // }, [data])
    const now = dayjs();
    const { buttonActions } = restProps;
    //CONTEXT

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

    return (
        <>
            <Table className="border border-solid border-[#ebebeb]">
                <TableHeader>
                    <TableRow>
                        {tableColumn && tableColumn.map((column, index) => (
                            <TableHead key={index}>{column.name}</TableHead>
                        ))}
                        <TableHead className="text-center">Chi tiết</TableHead>
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
                            className={`${checkedState[row.id] ? 'bg-[#ffc]' : ''} ${dayjs(`${row.date} ${dayjs(row.end_time).format('hh:mm A')}`).isBefore(now) ? 'opacity-50' : ''}`}
                        >
                            {tableColumn && tableColumn.map((column, index) => (
                                <TableCell key={index}>{column.render(row)}</TableCell>

                            ))}
                            <TableCell className="flex justify-center">
                                {buttonActions && buttonActions.map((action: any, index: number) => {
                                    // Nếu trạng thái là 'pending' hoặc hành động là 'create' (xem chi tiết)
                                    if (row.status === 'pending' || action.method === 'create') {
                                        return (
                                            <Button
                                                key={index}
                                                className={`${action.className} p-[15px]`}
                                                onClick={
                                                    action.onClick && action.params ? (e: React.MouseEvent<HTMLButtonElement>) => {
                                                        const args = action.params?.map((param: any) => {
                                                            if (typeof param === 'string' && (param.endsWith(':f') || param.endsWith(':pf') || param.endsWith(':c'))) {
                                                                if (param.endsWith(':f')) {
                                                                    return eval(param.slice(0, -2));
                                                                } else if (param.endsWith(':pf')) {
                                                                    const functionName = param.slice(0, -3);
                                                                    return restProps[functionName];
                                                                } else if (param.endsWith(':c')) {
                                                                    return action.component;
                                                                }
                                                            } else {
                                                                return row[param as keyof Row];
                                                            }
                                                        }) as ParamsToTuple<typeof action.params>;
                                                        if (action.onClick) {
                                                            action.onClick(...args);
                                                        }
                                                    } : undefined
                                                }
                                            >
                                                {action.icon}
                                            </Button>
                                        );
                                    }
                                    return null; // Ẩn nếu không thỏa mãn điều kiện
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
        </>
    )
}

export default TableHistoryPatient
