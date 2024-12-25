//REACT
import React, { useState } from "react"
//COMPONENT
import LoadingButton from "@/components/LoadingButton"
import { Button } from "@/components/ui/button"
import { Label } from "./ui/label"
import { Input } from "./ui/input"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"


interface CustomDialogProps {
    children: React.ReactNode,
    heading: string,
    description: string,
    buttonLoading: boolean
}
const CustomDialog = ({
    children,
    heading,
    description,
    buttonLoading
}: CustomDialogProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
    return (
        <>
            <Dialog open={isDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{heading}</DialogTitle>
                        <DialogDescription>
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                    {children}
                    <DialogFooter>
                        <LoadingButton loading={buttonLoading} text="Đổi mật khẩu" />
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

export default CustomDialog