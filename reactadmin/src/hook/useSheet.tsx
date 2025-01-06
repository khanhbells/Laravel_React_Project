import { useState } from "react"

export interface Sheet {
    open: boolean,
    action: string,
    id: string | undefined,
}

const useSheet = () => {
    const [isSheetOpen, setIsSheetOpen] = useState<Sheet>({ open: false, action: '', id: undefined })
    const openSheet = ({ action, id }: Sheet) => {
        setIsSheetOpen({ open: true, action, id })
    }
    const closeSheet = () => setIsSheetOpen({ ...isSheetOpen, open: false })

    return { isSheetOpen, openSheet, closeSheet }
}

export default useSheet