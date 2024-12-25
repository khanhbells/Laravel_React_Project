import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { CustomAlertDialogProps } from "@/interfaces/BaseServiceInterface"
import { ReloadIcon } from "@radix-ui/react-icons"
const CustomAlertDialog = ({
    isOpen,
    title,
    description,
    closeAlertDialog,
    confirmAction,
    isDialogLoading
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
                        <AlertDialogAction disabled={isDialogLoading} className="cursor-pointer" onClick={confirmAction} >
                            {isDialogLoading ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> : null}
                            {isDialogLoading ? 'Đang xử lý' : 'Thực hiện thao tác'}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}

export default CustomAlertDialog