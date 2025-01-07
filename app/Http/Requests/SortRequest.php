<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SortRequest extends FormRequest
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
            'id' => 'required',
            'model' => 'required',
            'value' => 'required',
        ];
    }

    public function messages(): array
    {
        return [
            'id.required' => 'Thiếu thông tin id',
            'model.required' => 'Thiếu thông tin model',
            'value.required' => 'Thiếu giá trị value',
        ];
    }
}
