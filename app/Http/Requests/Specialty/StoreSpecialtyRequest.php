<?php

namespace App\Http\Requests\Specialty;

use Illuminate\Foundation\Http\FormRequest;

class StoreSpecialtyRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    public function prepareForValidation() {}

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required',
            'canonical' => 'required|unique:posts',
            'specialty_catalogue_id' => 'required|gt:0'
        ];
    }
    public function messages(): array
    {
        return [
            'name.required' => 'Tên chuyên khoa không được để trống',
            'canonical.required' => 'Đường dẫn không được để trống',
            'canonical.unique' => 'Đường dẫn đã tồn tại',
            'specialty_catalogue_id.required' => 'Danh mục cha là bắt buộc',
            'specialty_catalogue_id.gt' => 'Giá trị cho danh mục cha không hợp lệ',
        ];
    }
}
