<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdateByFieldRequest extends FormRequest
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
            'value' => 'required',
            'column' => 'required',
        ];
    }
    public function messages(): array
    {
        return [
            'value.required' => 'Giá trị cập nhật không hợp lệ',
            'column.required' => 'Cột dữ liệu cần cập nhật không hợp lệ'
        ];
    }
}
