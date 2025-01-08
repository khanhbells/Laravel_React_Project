<?php

namespace App\Http\Requests\Tag;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTagRequest extends FormRequest
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
            'canonical' => 'required|unique:tags,canonical,' . $this->id . '',
        ];
    }

    public function messages(): array
    {
        return [
            'name.required' => 'Bạn chưa nhập vào tên!',
            'canonical.required' => 'Bạn chưa nhập vào đường dẫn của tag!',
            'canonical.unique' => 'Đường dẫn tag bị trùng lặp!',
        ];
    }
}
