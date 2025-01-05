import { SubmitHandler, FieldValues } from "react-hook-form"
import { useMutation } from "react-query"
import { showToast } from "@/helper/myHelper"
import { useState } from "react"

type SubmitFunction<T extends FieldValues> = (
    data: T,
    updateParams: { action: string, id: string | undefined },
    album?: string[]
) => Promise<void>

const useFormSubmit = <T extends FieldValues, U extends Record<string, any>>(
    submitFn: SubmitFunction<T>,
    updateParams: { action: string, id: string | undefined },
    album?: string[] | null,
    refetch?: any | null,
    closeSheet?: () => void | undefined,

) => {

    const [isSuccess, setIsSuccess] = useState(false);

    const mutation = useMutation<void, Error, T>({
        mutationFn: (payload) => submitFn(payload, updateParams),
        onSuccess: (response) => {
            showToast('Cập nhật dữ liệu thành công', 'success');
            if (closeSheet) {
                closeSheet()
            }
            if (refetch) {
                refetch()
            }
            setIsSuccess(true);
        },
        onError: (error: any) => {
            console.error('Lỗi: ', error);
            showToast(error.response.data.message, 'error');
        }
    })
    const onSubmitHanler: SubmitHandler<T> = async (payload) => {
        if (album) {
            const formPayload = { ...payload, album }
            mutation.mutate(formPayload)
        } else {
            mutation.mutate(payload)
        }

    }
    return {
        onSubmitHanler,
        success: mutation.isSuccess,
        error: mutation.isError,
        loading: mutation.isLoading,
        isSuccess
    }
}

export default useFormSubmit