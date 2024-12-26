//REACT
import React, { ReactNode, useState } from "react"
//COMPONENT
import LoadingButton from "@/components/LoadingButton"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog"


interface CustomDialogProps {
    children: ReactNode,
    heading: string,
    description: string,
    buttonLoading: boolean,
    open: boolean,
    close: () => void
}
const CustomDialog = ({
    children,
    heading,
    description,
    buttonLoading,
    open,
    close
}: CustomDialogProps) => {

    return (
        <>
            <Dialog open={open} onOpenChange={close}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{heading}</DialogTitle>
                        <DialogDescription className="text-[12px] text-[#f00]">
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    {children}
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CustomDialog