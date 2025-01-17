<?php

namespace App\Http\Requests\Time;

use Illuminate\Foundation\Http\FormRequest;

class StoreTimeSlotRequest extends FormRequest
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
            'start_time' => 'required',
            'end_time' => 'required',
        ];
    }

    public function messages(): array
    {
        return [
            'start_time.required' => 'Bạn chưa nhập vào thời gian bắt đầu!',
            'end_time.required' => 'Bạn chưa nhập vào thời gian kết thúc!',
        ];
    }
}
