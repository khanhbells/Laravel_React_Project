import { PayloadBookingInput } from "@/interfaces/types/BookingType";

export const redirectIfSucces = '/homepage/success'
export const formField = () => {

    const baseField = [
        {
            label: "Họ tên *",
            name: "full_name",
            type: "text",
            value: ''
        },
        {
            label: "Email *",
            name: "email",
            type: "text",
            value: ''

        },
        {
            label: "Điện thoại *",
            name: "phone",
            type: "text",
            value: ''
        },
        {
            label: "Ngày sinh",
            name: "birthday",
            type: "date",
            value: ''
        },
    ]

    return baseField;
}