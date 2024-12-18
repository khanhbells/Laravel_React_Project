import { SubmitHandler, FieldValues } from "react-hook-form"
import { useMutation } from "react-query"
import { showToast } from "@/helper/myHelper"

type SubmitFunction<T extends FieldValues> = (data: T) => Promise<void>

const useFormSubmit = <T extends FieldValues,>(submitFn: SubmitFunction<T>, refetch: any, closeSheet: () => void) => {

    const mutation = useMutation<void, Error, T>({
        mutationFn: submitFn,
        onSuccess: () => {
            closeSheet()
            showToast('Khởi tạo dữ liệu thành công', 'success');
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