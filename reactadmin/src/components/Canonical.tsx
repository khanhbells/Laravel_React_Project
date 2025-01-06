import { memo } from "react"
import { useFormContext, Path } from "react-hook-form"
import { Input } from "./ui/input"
import { Label } from "./ui/label"

interface ICanonical {
    onSeoChange: (e: any, canonical: string) => void
}

const Canonical = ({
    onSeoChange
}: ICanonical) => {
    const { register, formState: { errors } } = useFormContext()
    const canonicalErrorMessage = errors['canonical']?.message
    return (
        <>
            <div className="gap-4">
                <Label className="block mb-[10px]" htmlFor="canonical">
                    Đường dẫn <span className="text-[#f00]">(*)</span>
                </Label>
                <div className="input-wrapper relative flex items-center">
                    <span className="h-[36px] leading-[34px] inline-block px-[10px] left-0 top-0 border-[#c4cdd5]
                                                bg-gradient-to-b from-white to-[#f9fafb] border
                                                ">https://localhost:5173</span>
                    <Input
                        type="text"
                        id="canonical"
                        className="col-span-3 focus-visible:ring-0 focus:outline-none focus:border-sky-500 focus:ring-0 border-[#ccced1] text-[blue] font-bold flex-1
                                                    border-l-0 rounded-none
                                                    "
                        {...register("canonical")}
                        defaultValue=""
                        onChange={(e: any) => onSeoChange(e, 'canonical')}
                    />
                </div>
                {
                    canonicalErrorMessage &&
                    <div className="error-line text-right " >
                        {typeof canonicalErrorMessage === 'string' && (
                            <span className="text-red-500 text-xs">{canonicalErrorMessage}</span>
                        )}
                    </div>
                }
            </div>
        </>
    )
}

export default memo(Canonical)