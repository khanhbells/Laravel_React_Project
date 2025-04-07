import { Patient } from "@/types/Patient";

export const formField = (action: string, data?: Patient | undefined) => {
    const showPasswordField = action !== 'update'
    const baseField = [
        {
            label: "Họ tên *",
            name: "name",
            type: "text",
            value: data && data.name
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

    const passwordFields = [
        {
            label: "Mật khẩu (*)",
            name: "password",
            type: "password",
            value: ''
        },
        {
            label: "Nhập lại mk (*)",
            name: "confirmPassword",
            type: "password",
            value: ''
        }
    ]

    return showPasswordField ? [...baseField, ...passwordFields] : baseField;
}