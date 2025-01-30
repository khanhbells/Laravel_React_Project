import React, { useEffect, useState } from "react"

import { Checkbox } from "../components/ui/checkbox"
import { Switch } from "../components/ui/switch"


import { LoadingSpinner } from "../components/ui/loading"

import useColumnState from "../hook/useColumnState"

import useDialog from "@/hook/useDialog"
import { CustomTableProps } from "@/interfaces/BaseServiceInterface"
import dayjs from "dayjs"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table"


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
    refetch,
    ...restProps
}: CustomTableProps) => {

    // useEffect(() => {
    //     console.log(data);
    // }, [data])
    const now = dayjs();

    //CONTEXT

    const { columnState, handleChecked, setInitialColumnState } = useColumnState()
    const { confirmAction, openAlertDialog, closeAlertDialog, alertDialogOpen, isLoading: isDialogLoading } = useDialog(refetch)


    const [setDialogComponent] = useState<React.ComponentType<any> | null>(null)

    const [setIsDialogOpen] = useState<boolean>(false)



    const handleAlertDialog = (id: string, callback: any) => {
        openAlertDialog(id, callback)

        //Follow theo isLoading và data
        useEffect(() => {
            if (!isLoading && data[model]) {
                setInitialColumnState(data[model], 'publish')
            }
        }, [isLoading, data])
    }

    return (
        <>
            <Table className="border border-solid border-[#ebebeb]">
                <TableHeader>
                    <TableRow>
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
                        {tableColumn && tableColumn.map((column, index) => (
                            <TableHead key={index}>{column.name}</TableHead>
                        ))}
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
                            <TableCell className="font-medium">
                                <Checkbox id="checkAll"
                                    className="text-white"
                                    checked={checkedState[row.id] || false}
                                    onCheckedChange={() => handleCheckedChange(row.id)}
                                />
                            </TableCell>
                            {tableColumn && tableColumn.map((column, index) => (
                                <TableCell key={index}>{column.render(row)}</TableCell>

                            ))}
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
        </>
    )
}

export default TableHistoryPatient
