<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class ChangePasswordUserRequest extends FormRequest
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
            'password' => 'required',
            're_password' => 'required|same:password',
        ];
    }
    public function messages(): array
    {
        return [
            'password.required' => 'Bạn chưa nhập vào mật khẩu!',
            're_password.required' => 'Bạn chưa nhập vào xác nhận mật khẩu!',
            're_password.same' => 'Mật khẩu không khớp!',
        ];
    }
}
