//CORE REACT
//COMPONENT
//HOOK
//SETTING
//SERVICE
//INTERFACES
import BookingDoctorSchedule from "@/components/BookingDoctorSchedule";
import BookingInforPatient from "@/components/BookingInforPatient";
import BookingMedicine from "@/components/BookingMedicine";
import { UserCatalogueStoreProps } from "@/interfaces/UserCatalogueInterface";
import { IHistory, getHistoryById } from "@/service/HistoryService";
import { memo } from "react";
import { useQuery } from "react-query";




const Store = ({ id, action, refetch, closeSheet }: UserCatalogueStoreProps) => {

    const { data, isLoading, isError } = useQuery<IHistory>(['history', id],
        () => getHistoryById(id),
        {
            enabled: action === 'update' && !!id,
        }
    )
    return (
        <>
            <BookingInforPatient
                data={data}
            />
            <BookingDoctorSchedule
                data={data}
            />
            {
                data && data.medicines && data.medicines.length > 0 &&
                <BookingMedicine
                    data={data}
                />
            }
        </>
    )
}

export default memo(Store)