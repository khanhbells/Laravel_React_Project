import { CheckStateInterface } from "@/interfaces/BaseServiceInterface";
import { updateFieldByParams, deleteAll } from "@/service/BaseService";

const useFilterAction = () => {

    const actionSwitch = (action: string, selectedValue: string, { checkedState }: CheckStateInterface, model: string, refetch: any) => {

        // Trong 1 danh sách các dữ liệu cần lọc ra 1 dữ liệu gì đấy dựa vào điều kiện thì dùng filter
        const ids = Object.keys(checkedState).filter((key) => checkedState[Number(key)])
        switch (action) {
            case 'deleteAll':
                deleteAll(ids, model, refetch)
                break;
            // case 'publish':
            //     updateFieldByParams(ids)
            //     break;
        }

    }
    return { actionSwitch }
}
export default useFilterAction