export interface updateStatusByFieldParam {
    id: string | number,
    column: string,
    value: string | number | boolean,
    model: string
}

export interface FilterProps {
    isAnyChecked: boolean
}