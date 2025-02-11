<?php

namespace App\Http\Requests\User;

use Illuminate\Foundation\Http\FormRequest;

class ChangePasswordUserTokenRequest extends FormRequest
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
            'confirmPassword' => 'required|same:password',
            'token' => 'required',
            'email' => 'required|email|exists:users,email',
        ];
    }
    public function messages(): array
    {
        return [
            'password.required' => 'Bạn chưa nhập vào mật khẩu!',
            'confirmPassword.required' => 'Bạn chưa nhập vào xác nhận mật khẩu!',
            'confirmPassword.same' => 'Mật khẩu không khớp!',
            'token.required' => 'Token không tồn tại!',
            'email.required' => 'Email trống!',
            'email.email' => 'Email không đúng định dạng!',
            'email.exists' => 'Email không tồn tại!',
        ];
    }
}
