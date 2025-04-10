<?php

namespace App\Http\Requests\Patient;

use Illuminate\Foundation\Http\FormRequest;

class ChangePasswordPatientRequest extends FormRequest
{
    /**
     * Determine if the patient is authorized to make this request.
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
        ];
    }
    public function messages(): array
    {
        return [
            'password.required' => 'Bạn chưa nhập vào mật khẩu!',
            'confirmPassword.required' => 'Bạn chưa nhập vào xác nhận mật khẩu!',
            'confirmPassword.same' => 'Mật khẩu không khớp!',
        ];
    }
}
