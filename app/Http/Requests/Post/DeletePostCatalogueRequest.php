<?php

namespace App\Http\Requests\Post;

use App\Models\PostCatalogue;
use Illuminate\Foundation\Http\FormRequest;
use App\Rules\Post\CheckPostCatalogueChildrenRule;


class DeletePostCatalogueRequest extends FormRequest
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
        $id = $this->route('id');
        return [];
    }

    public function withValidator($validator)
    {
        $id = $this->route('id');
        $validator->after(function ($validator) use ($id) {
            $flag = PostCatalogue::hasChildren($id);
            if (!$flag) {
                $validator->errors()->add('id', 'Không thể xóa danh mục vì vẫn còn danh mục con');
            }
        });
    }
}
