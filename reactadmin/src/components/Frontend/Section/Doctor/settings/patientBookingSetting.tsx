import { PayloadBookingInput } from "@/interfaces/types/BookingType";
import { PatientBooking } from "@/types/Patient";

export const redirectIfSucces = '/homepage/success'
export const formField = (data?: PatientBooking | undefined) => {

    const baseField = [
        {
            label: "Họ tên *",
            name: "full_name",
            type: "text",
            value: data && data.full_name
        },
        {
            label: "Email *",
            name: "email",
            type: "text",
            value: data && data.email

        },
        {
            label: "Điện thoại *",
            name: "phone",
            type: "text",
            value: data && data.phone
        },
        {
            label: "Ngày sinh",
            name: "birthday",
            type: "date",
            value: data && data.birthday
        },
    ]

    return baseField;
}