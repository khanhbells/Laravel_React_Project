import { useMemo, useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { findById } from '@/service/Frontend/FrontEndService';
import { endpoint } from '@/constant/endpoint';
import { pagination } from '@/service/ScheduleService';
import { queryKey } from '@/constant/query';
import { getDropdownDate } from '@/helper/myHelper';

const useDetailDoctor = (specialId: string | undefined, doctorId: string | undefined) => {
    const model = 'schedules';
    const [getData, setData] = useState<any[]>([]);

    const { data: dataDoctor, isLoading: isDoctorLoading } = useQuery(
        [queryKey.doctors, doctorId],
        () => findById(doctorId, endpoint.doctors),
        { enabled: !!doctorId }
    );

    const { data: dataSpecialties, isLoading: isSpecialtyLoading } = useQuery(
        [queryKey.specialties, specialId],
        () => findById(specialId, endpoint.specialties),
        { enabled: !!specialId }
    );

    const { data: dataSchedule, isLoading: isScheduleLoading } = useQuery(
        [model],
        () => pagination(`&publish=2&doctor_id=${doctorId}`)
    );

    const schedules = useMemo(() => {
        if (!isScheduleLoading && dataSchedule) {
            return dataSchedule[model] ? getDropdownDate(dataSchedule[model]) : [];
        }
        return [];
    }, [dataSchedule, isScheduleLoading]);

    useEffect(() => {
        if (!isScheduleLoading && dataSchedule?.schedules) {
            setData(dataSchedule.schedules);
        }
    }, [dataSchedule, isScheduleLoading]);

    return { dataDoctor, dataSpecialties, schedules, getData, isDoctorLoading, isSpecialtyLoading };
};

export default useDetailDoctor;
