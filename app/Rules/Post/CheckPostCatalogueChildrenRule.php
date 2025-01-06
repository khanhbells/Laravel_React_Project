<?php

namespace App\Rules\Post;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use App\Models\PostCatalogue;

class CheckPostCatalogueChildrenRule implements ValidationRule
{

    protected $id;
    public function __construct($id)
    {
        $this->id = $id;
    }
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string, ?string=): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        dd(1);
        $flag = PostCatalogue::hasChildren($this->id);
        if ($flag === false) {
            $fail('Không thể xóa vì vẫn còn tồn tại danh mục con');
        }
    }
}
