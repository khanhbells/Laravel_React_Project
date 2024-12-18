<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class StoreUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required',
            'email' => 'required|unique:users|email',
            'phone' => 'required',
            'password' => 'required',
            're_password' => 'required|same:password',
            'user_catalogue_id' => 'gt:0',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Bạn chưa nhập vào Họ tên!',
            'email.required' => 'Bạn chưa nhập vào Email!',
            'email.unique' => 'Email đã tồn tại hãy chọn email khác!',
            'email.email' => 'Email chưa đúng định dạng! Ví dụ: abc@gmail.com',
            'password.required' => 'Bạn chưa nhập vào mật khẩu!',
            're_password.required' => 'Bạn chưa nhập vào xác nhận mật khẩu!',
            're_password.same' => 'Mật khẩu không khớp!',
            'user_catalogue_id.gt' => 'Bạn chưa chọn nhóm thành viên',
        ];
    }
}
