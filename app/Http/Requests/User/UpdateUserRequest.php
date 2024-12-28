<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }
    /**
     * Determine if the user is authorized to make this request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required',
            'email' => 'required|string|email|unique:users,email,' . $this->id . '|max:191',
            'phone' => 'required',
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
            'user_catalogue_id.gt' => 'Bạn chưa chọn nhóm thành viên',
        ];
    }
}
