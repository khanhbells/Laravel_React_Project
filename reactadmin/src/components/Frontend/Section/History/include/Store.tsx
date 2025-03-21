//CORE REACT
//COMPONENT
//HOOK
//SETTING
//SERVICE
//INTERFACES
import BookingDoctorSchedule from "@/components/BookingDoctorSchedule";
import BookingInforPatient from "@/components/BookingInforPatient";
import BookingMedicine from "@/components/BookingMedicine";
import { Button } from "@/components/ui/button";
import { UserCatalogueStoreProps } from "@/interfaces/UserCatalogueInterface";
import { IHistory, getHistoryById } from "@/service/HistoryService";
import { memo, useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useQuery } from "react-query";

const Store = ({
    id,
    action,
    refetch,
    closeSheet,
}: UserCatalogueStoreProps) => {
    const [data, setData] = useState<any>();

    const {
        data: dataHistory,
        isLoading,
        isError,
    } = useQuery<IHistory>(["history", id], () => getHistoryById(id), {
        enabled: action === "update" && !!id,
    });

    //useForm
    const methods = useForm<any>({
        context: { action },
        mode: "onSubmit",
    });
    useEffect(() => {
        if (!isLoading && dataHistory && dataHistory.bookings) {
            setData(dataHistory.bookings);
        }
        dataHistory;
    }, [dataHistory, isLoading]);

    const handleStopBooking = () => {};

    return (
        <>
            <FormProvider {...methods}>
                <BookingInforPatient data={data} />
                <BookingDoctorSchedule data={data} />
                {data && data.medicines && data.medicines.length > 0 && (
                    <BookingMedicine data={data} />
                )}
            </FormProvider>
        </>
    );
};

export default memo(Store);
