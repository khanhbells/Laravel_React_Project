export interface updateStatusByFieldParam {
    id: string | number,
    column: string,
    value: string | number | boolean,
    model: string
}

export interface CheckStateInterface {
    checkedState: { [id: number]: boolean }
}

export interface FilterProps extends CheckStateInterface {
    isAnyChecked: boolean,
    model: string
    refetch: any

}