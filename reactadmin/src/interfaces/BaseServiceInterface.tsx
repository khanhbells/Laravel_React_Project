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
    model: string,
    refetch: any,
    handleQueryString: any
    openSheet: () => void
}

export interface CustomAlertDialogProps {
    isOpen: boolean,
    title: string,
    description: string,
    closeAlertDialog: () => void,
    confirmAction: () => void
}