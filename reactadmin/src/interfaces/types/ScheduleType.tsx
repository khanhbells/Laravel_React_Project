export interface TimeSlot {
    time_slot_id: string,
    price: string
}

export type SchedulePayloadInput = {
    user_id: string;
    doctor_id?: string;
    time_slots: TimeSlot[];
    date: string;
    publish?: string | undefined;
    status?: string
};

export type SchedulePayloadForSubmit = Omit<SchedulePayloadInput, 'time_slots'> & {
    time_slots?: string
}

export type Schedule = {
    [key: string]: string
}