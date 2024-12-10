import { useEffect } from "react"
import { Link, useSearchParams, useNavigate } from "react-router-dom"

import { Checkbox } from "../components/ui/checkbox"
import { Switch } from "../components/ui/switch"
import { Button } from "../components/ui/button"


import { LoadingSpinner } from "../components/ui/loading"

import useColumnState from "../hook/useColumnState"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../components/ui/table"

import { buttonActions } from "../service/UserService"

import { tableColumn } from "../service/UserService"

//CheckedState
import useCheckBoxState from "../hook/useCheckBoxState"

// import { pagination, breadcrumb, model } from "../service/UserService"
// import { useQuery } from "react-query"
// import { User } from "../types/User"
interface CustomTableProps {
    data: any,
    isLoading: boolean,
    isError: boolean,
    model: string,
    tableColumn: Array<{ name: string; render: (item: any) => JSX.Element }>,
    checkedState: { [key: number]: boolean },
    checkedAllState: boolean,
    handleCheckedChange: (id: number) => void
    handleCheckedAllChange: () => void
}

const CustomTable = ({
    data,
    isLoading,
    isError,
    model,
    tableColumn,
    checkedState,
    checkedAllState,
    handleCheckedChange,
    handleCheckedAllChange }: CustomTableProps) => {

    const { columnState, handleChecked, setInitialColumnState } = useColumnState()


    //Follow theo isLoading và data
    useEffect(() => {
        if (!isLoading && data[model]) {
            setInitialColumnState(data[model], 'publish')
        }

    }, [isLoading, data])

    return (
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
                    <TableHead className="text-center">Tình trạng</TableHead>
                    <TableHead className="text-center">Tác vụ</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {isLoading ? (
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
                ) : data[model].length ? (data[model] && data[model].map((row: any, index: number) => (
                    <TableRow key={index} className={checkedState[row.id] ? 'bg-[#ffc]' : ''}>
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
                        <TableCell className="text-center">
                            <Switch value={row.id} checked={columnState[row.id]?.publish} onCheckedChange={() => handleChecked(row.id, 'publish', model)} />
                        </TableCell>
                        <TableCell className="flex justify-center">
                            {buttonActions && buttonActions.map((action, index) => (
                                <Button key={index} className={`${action.className} p-0`}>
                                    <Link className="block p-[15px]" to={`${action.path}/${row.id}`}>{action.icon}</Link>
                                </Button>
                            ))}
                        </TableCell>
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
        </Table>
    )
}


export default CustomTable