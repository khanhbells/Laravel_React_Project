export type TimeSlotPayloadInput = {
    start_time: string,
    end_time: string,
};
export type TimeSlot = {
    id: string,
    start_time: string,
    end_time: string,
    [key: string]: string
}