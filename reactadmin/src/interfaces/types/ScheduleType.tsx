export type SchedulePayloadInput = {
    user_id?: string;
    doctor_id: string;
    time_slots: { // Mảng chứa các đối tượng time slot
        time_slot_id: string;
        price: string; // Giá tiền
    }[];
    date?: string;
    publish?: string | undefined;
};



export type Schedule = {
    [key: string]: string
}