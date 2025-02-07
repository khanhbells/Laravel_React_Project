<?php

namespace App\Http\Requests\Medicine;

use Illuminate\Foundation\Http\FormRequest;

class StoreMedicineRequest extends FormRequest
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
            'canonical' => 'required|unique:medicines',
            'medicine_catalogue_id' => 'required|gt:0'
        ];
    }
    public function messages(): array
    {
        return [
            'name.required' => 'Tên bài viết không được để trống',
            'canonical.required' => 'Đường dẫn không được để trống',
            'canonical.unique' => 'Đường dẫn đã tồn tại',
            'medicine_catalogue_id.required' => 'Danh mục cha là bắt buộc',
            'medicine_catalogue_id.gt' => 'Giá trị cho danh mục cha không hợp lệ',
        ];
    }
}
