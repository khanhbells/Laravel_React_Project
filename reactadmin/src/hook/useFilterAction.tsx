import { CheckStateInterface } from "@/interfaces/BaseServiceInterface";
import { updateFieldByParams, deleteAll } from "@/service/BaseService";

const useFilterAction = () => {

    const actionSwitch = async (action: string, selectedValue: string, { checkedState }: CheckStateInterface, model: string, refetch: any) => {

        // Trong 1 danh sách các dữ liệu cần lọc ra 1 dữ liệu gì đấy dựa vào điều kiện thì dùng filter
        const ids = Object.keys(checkedState).filter((key) => checkedState[Number(key)])
        let response
        switch (action) {
            case 'deleteAll':
                response = await deleteAll(ids, model, refetch)
                break;
            case 'publish':
                response = await updateFieldByParams(action, ids, model, selectedValue, refetch)
                break;
        }

        return response

    }
    return { actionSwitch }
}
export default useFilterAction