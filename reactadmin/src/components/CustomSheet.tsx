import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose
} from "@/components/ui/sheet"
import useSheet from "@/hook/useSheet"

interface CusomSheetProps {
    title: string | undefined,
    description: string | undefined,
    isSheetOpen: boolean,
    closeSheet: () => void,
    children: any,
    className: string | undefined
}

const CustomSheet = ({ children, isSheetOpen, closeSheet, title, className, description }: CusomSheetProps) => {

    return (
        <>
            <Sheet open={isSheetOpen} onOpenChange={closeSheet}>
                <SheetContent className={`${className ?? ''} overflow-scroll`}>
                    <SheetHeader>
                        <SheetTitle>{title}</SheetTitle>
                        <SheetDescription className="text-[#f00000] text-xs">
                            {description}
                        </SheetDescription>
                    </SheetHeader>
                    {children}
                </SheetContent>

            </Sheet>
        </>
    )
}
export default CustomSheet