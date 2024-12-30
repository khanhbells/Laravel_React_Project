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
    handleQueryString: any,
    items: BaseFilterItem[],
    buttonText: string
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
    [key: string]: any
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
    value: Option | null,
    name: string,
    control: any,
}

export interface BaseFilterItem {
    value: string,
    label: string,
    icon: React.ReactNode
}

export interface SelectOption {
    value: string,
    label: string
}

export interface Select {
    placeholder: string,
    id?: string,
    items: SelectOption[]
}

export type Row = Record<string, any>
export type OpenSheetFunction = (sheet: Sheet) => void
export type ActionParam = keyof Row | `${string}:f` | `${string}:c` | `${string}:pf` // pf: prop function:

export type ParamToType<T extends ActionParam> =
    T extends `${string}:f` ? Function :
    T extends `${string}:pf` ? Function :
    T extends `${string}:c` ? React.ComponentType<any> :
    T extends keyof Row ? Row[T] :
    never;
export type ParamsToTuple<T extends ActionParam[]> = {
    [K in keyof T]: ParamToType<T[K]>
}

export interface ButtonAction<T extends ActionParam[]> {
    params?: T,
    className: string,
    icon?: React.ReactNode,
    path?: string,
    method?: string,
    onClick?: (...agrs: ParamsToTuple<T>) => void,
    component?: React.ComponentType<any>
}

export interface StoreProps {
    refetch: any;
    closeSheet: () => void,
    id: string | null,
    action: string
}
