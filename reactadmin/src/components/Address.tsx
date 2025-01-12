//REACT
import { memo, useState } from "react";
//COMPONENT
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import CustomInput from "./CustomInput";
//INTERFACE


const Parent = () => {


    return (
        <>
            <Card className="rounded-[5px] mb-[20px]">
                <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                    <CardTitle className="uppercase">
                        Địa chỉ
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-[10px]">
                    <CustomInput
                        name="address"
                        type="text"
                        className="w-full"
                    />
                </CardContent>
            </Card>
        </>
    )
}

export default memo(Parent)