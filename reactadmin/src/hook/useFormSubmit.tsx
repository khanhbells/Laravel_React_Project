import { useState } from "react"
import { SubmitHandler, FieldValues } from "react-hook-form"
import { useMutation, UseMutationResult } from "react-query"

type SubmitFunction<T extends FieldValues> = (data: T) => Promise<void>

const useFormSubmit = <T extends FieldValues,>(submitFn: SubmitFunction<T>) => {
    const [loading, setLoading] = useState<boolean>(false)
    const mutation = useMutation<void, Error, T>({
        mutationFn: submitFn,
        onSuccess: () => {
            console.log('Khởi tạo dữ liệu thành công');

        },
        onError: (error) => {
            console.error('Lỗi: ', error);

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