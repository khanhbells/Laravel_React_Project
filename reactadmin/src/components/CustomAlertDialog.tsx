import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { CustomAlertDialogProps } from "@/interfaces/BaseServiceInterface"

const CustomAlertDialog = ({ isOpen,
    title,
    description,
    closeAlertDialog,
    confirmAction
}: CustomAlertDialogProps) => {
    return (
        <>
            <AlertDialog open={isOpen}>
                {/* <AlertDialogTrigger>Open</AlertDialogTrigger> */}
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{title}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {description}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={closeAlertDialog}>Hủy bỏ</AlertDialogCancel>
                        <AlertDialogAction onClick={confirmAction}>Tiếp tục</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default CustomAlertDialog