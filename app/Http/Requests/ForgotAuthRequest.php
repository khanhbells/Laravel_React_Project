<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ForgotAuthRequest extends FormRequest
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
            'email' => 'required|email|exists:users,email'
        ];
    }
    public function messages(): array
    {
        return [
            'email.required' => 'Email không được để trống!',
            'email.email' => 'Không đúng định dạng email!',
            'email.email' => 'Không đúng định dạng email!',
            'email.exists' => 'Email không tồn tại!',
        ];
    }
}
