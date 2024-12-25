import { Sheet } from "@/hook/useSheet"
import { Option } from "@/components/CustomSelectBox"

export interface SheetProps {
    openSheet: (sheet: Sheet) => void
}

export interface updateStatusByFieldParam {
    id: string | number,
    column: string,
    value: string | number | boolean,
    model: string
}

export interface CheckStateInterface {
    checkedState: { [id: number]: boolean }
}

export interface FilterProps extends CheckStateInterface, SheetProps {
    isAnyChecked: boolean,
    model: string,
    refetch: any,
    handleQueryString: any
}

export interface CustomTableProps extends SheetProps {
    data: any,
    isLoading: boolean,
    isError: boolean,
    model: string,
    tableColumn: Array<{ name: string; render: (item: any) => JSX.Element }>,
    checkedState: { [key: number]: boolean },
    checkedAllState: boolean,
    handleCheckedChange: (id: number) => void,
    handleCheckedAllChange: () => void,
    destroy: (id: string) => void,
    refetch: any,
}


export interface CustomAlertDialogProps {
    isOpen: boolean,
    title: string,
    description: string,
    closeAlertDialog: () => void,
    confirmAction?: () => void,
    isDialogLoading?: boolean

}

export interface SelectBoxItem {
    title: string | undefined,
    placeholder: string | undefined,
    options: Option[],
    onSelectChange?: (value: string | undefined) => void,
    isLoading?: boolean,
    rules?: object,
    value: Option | null,
    name: string,
    control: any,
    errors: any,
}