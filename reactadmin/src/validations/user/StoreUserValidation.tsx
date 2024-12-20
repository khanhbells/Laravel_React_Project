import axios from "axios"
import { User } from "@/types/User"
import { useEffect, useState } from "react"

export const validation = (action: string, password: any, data?: User | undefined) => {

    const showPasswordField = action !== 'update'

    const baseValidationData = [
        {
            label: "Họ tên *",
            name: "name",
            type: "text",
            rules: {
                required: 'Bạn chưa nhập vào Họ tên'
            },
            defaultValue: data && data.name
        },
        {
            label: "Email *",
            name: "email",
            type: "text",
            rules: {
                required: 'Bạn chưa nhập vào Email',
                pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "Email nhập vào không đúng định dạng"
                },
            },
            defaultValue: data && data.email

        },
        {
            label: "Điện thoại *",
            name: "phone",
            type: "text",
            rules: {
                required: 'Bạn chưa nhập vào điện thoại'
            },
            defaultValue: data && data.phone
        },
        {
            label: "Ngày sinh",
            name: "birthday",
            type: "date",
            // defaultValue: data && data.birthday
        },
    ]

    const passwordFields = [
        {
            label: "Mật khẩu (*)",
            name: "password",
            type: "password",
            rules: {
                required: 'Bạn chưa nhập vào mật khẩu'
            },
        },
        {
            label: "Nhập lại mk (*)",
            name: "re_password",
            type: "password",
            rules: {
                required: 'Bạn chưa nhập lại mật khẩu',
                validate: (value: any) => value === password.current || 'Mật khẩu không khớp'
            }
        }
    ]

    return showPasswordField ? [...baseValidationData, ...passwordFields] : baseValidationData;
}
