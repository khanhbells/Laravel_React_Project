import axios from "axios"

export const validation = (password: any) => [
    {
        label: "Họ tên *",
        name: "name",
        type: "text",
        rules: {
            required: 'Bạn chưa nhập vào Họ tên'
        }
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
        }
    },
    {
        label: "Điện thoại *",
        name: "phone",
        type: "text",
        rules: {
            required: 'Bạn chưa nhập vào điện thoại'
        }
    },
    {
        label: "Mật khẩu (*)",
        name: "password",
        type: "password",
        rules: {
            required: 'Bạn chưa nhập vào mật khẩu'
        }
    },
    {
        label: "Nhập lại mk (*)",
        name: "re_password",
        type: "password",
        rules: {
            required: 'Bạn chưa nhập lại mật khẩu',
            validate: (value: any) => value === password.current || 'Mật khẩu không khớp'
        }
    },
    {
        label: "Ngày sinh",
        name: "birthday",
        type: "date"
    },
]

