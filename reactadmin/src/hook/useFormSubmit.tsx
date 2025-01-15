import { SubmitHandler, FieldValues } from "react-hook-form"
import { useMutation, useQueryClient } from "react-query"
import { showToast } from "@/helper/myHelper"
import { useState } from "react"

type SubmitFunction<T extends FieldValues, R> = (
    data: T,
    updateParams: { action: string, id: string | undefined },
    album?: string[]
) => Promise<R>

const useFormSubmit = <T extends FieldValues, R>(
    submitFn: SubmitFunction<T, R>,
    updateParams: { action: string, id: string | undefined },
    album?: string[] | null,
    refetch?: any | null,
    closeSheet?: () => void | undefined,

) => {

    const [isSuccess, setIsSuccess] = useState(false);
    const queryClient = useQueryClient()

    const mutation = useMutation<R, Error, T>({
        mutationFn: (payload) => submitFn(payload, updateParams),
        onSuccess: (response) => {
            showToast('Cập nhật dữ liệu thành công', 'success');
            if (closeSheet) {
                // closeSheet()
            }
            if (refetch) {
                queryClient.invalidateQueries(refetch)
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
        isSuccess,
        data: mutation.data
    }
}

export default useFormSubmit