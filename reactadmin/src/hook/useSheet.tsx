import { useState } from "react"

const useSheet = () => {
    const [isSheetOpen, setIsSheetOpen] = useState<boolean>(false)
    const openSheet = () => {
        setIsSheetOpen(true)
    }
    const closeSheet = () => setIsSheetOpen(false)

    return { isSheetOpen, openSheet, closeSheet }
}

export default useSheet