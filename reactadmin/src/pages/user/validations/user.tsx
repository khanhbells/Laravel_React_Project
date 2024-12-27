import * as yup from 'yup';

const schema = yup.object().shape({
    name: yup.string().required('Bạn chưa nhập vào Họ tên').min(3, 'Tên người dùng tối thiểu phải có 3 ký tự'),
    email: yup.string().required('Bạn chưa nhập vào Email').email('Email không hợp lệ'),
    phone: yup.string().required('Bạn chưa nhập vào số điện thoại'),
    password: yup.string().when('action', {
        is: 'update',
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.required('Bạn chưa nhập vào ô mật khẩu').min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    }),
    confirmPassword: yup.string().when('action', {
        is: 'update',
        then: (schema) => schema.notRequired(),
        otherwise: (schema) => schema.required('Bạn chưa nhập vào ô xác nhận mật khẩu').oneOf([yup.ref('password')], 'Mật khẩu nhập lại không chính xác')
    }),
    user_catalogue_id: yup.string().required('Bạn chưa chọn nhóm thành viên'),
    province_id: yup.string().required('Bạn chưa chọn thành phố'),
    district_id: yup.string().required('Bạn chưa chọn quận/huyện'),
    ward_id: yup.string().required('Bạn chưa chọn phường/xã'),
    address: yup.string().optional(),
    birtday: yup.string().optional(),
    image: yup.mixed().optional()
})

export {
    schema
}