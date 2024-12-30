import { SubmitHandler, FieldValues } from "react-hook-form"
import { useMutation } from "react-query"
import { showToast } from "@/helper/myHelper"

type SubmitFunction<T extends FieldValues> = (
    data: T,
    updateParams: { action: string, id: string | null }
) => Promise<void>

const useFormSubmit = <T extends FieldValues, U extends Record<string, any>>(
    submitFn: SubmitFunction<T>,
    refetch: any,
    closeSheet: () => void,
    updateParams: { action: string, id: string | null }
) => {

    const mutation = useMutation<void, Error, T>({
        mutationFn: (payload) => submitFn(payload, updateParams),
        onSuccess: (response) => {
            closeSheet()
            showToast('Cập nhật dữ liệu thành công', 'success');
            refetch()
        },
        onError: (error: any) => {
            console.error('Lỗi: ', error);
            showToast(error.response.data.message, 'error');
        }
    })
    const onSubmitHanler: SubmitHandler<T> = async (payload) => {


        mutation.mutate(payload)
    }
    return {
        onSubmitHanler,
        success: mutation.isSuccess,
        error: mutation.isError,
        loading: mutation.isLoading
    }
}

export default useFormSubmit