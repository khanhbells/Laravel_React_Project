//REACT
import { memo, useEffect, useMemo, useRef } from "react";
//COMPONENT
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import AdvanceItem from "./AdvanceItem";

import { publishs, follows } from "@/constant/general"

const Advance = () => {

    //useMemo
    const publishOptions = useMemo(() => {
        return publishs.filter(item => item.id !== 0).map(item => ({
            value: String(item.id),
            label: item.name
        }))
    }, [])
    const followOptions = useMemo(() => follows.filter(item => item.id !== 0).map(item => ({
        value: String(item.id),
        label: item.name
    })), [])


    return (
        <>
            <Card className="rounded-[5px] mb-[20px]">
                <CardHeader className="border-b border-solid border-[#f3f3f3] p-[15px]">
                    <CardTitle className="uppercase">
                        Cấu hình nâng cao
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-[10px]">
                    {publishOptions && <AdvanceItem options={publishOptions} name="publish" />}
                    {followOptions && <AdvanceItem options={followOptions} name="follow" />}
                </CardContent>
            </Card>
        </>
    )
}

export default memo(Advance)