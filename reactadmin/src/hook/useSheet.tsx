import { useState } from "react"
import { useDispatch } from "react-redux";

export interface Sheet {
    open: boolean,
    action: string,
    id: string | undefined,
}

const useSheet = () => {
    const [isSheetOpen, setIsSheetOpen] = useState<Sheet>({ open: false, action: '', id: undefined })
    const dispatch = useDispatch();
    const openSheet = ({ action, id }: Sheet) => {
        setIsSheetOpen({ open: true, action, id })
    }
    const closeSheet = () => {
        dispatch({ type: 'CLOSE_SHEET' });
        document.body.style.pointerEvents = 'auto'; // Gỡ khi đóng
        setIsSheetOpen({ ...isSheetOpen, open: false })
    }

    return { isSheetOpen, openSheet, closeSheet }
}

export default useSheet