<?php

namespace App\Http\Requests\Time;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Validator;
use App\Models\TimeSlot;

class UpdateTimeSlotRequest extends FormRequest
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

    /**
     * Kiểm tra khoảng thời gian đã tồn tại khi cập nhật
     */
    public function withValidator(Validator $validator)
    {
        $validator->after(function ($validator) {
            $startTime = formatTime($this->input('start_time'));
            $endTime = formatTime($this->input('end_time'));

            $exists = TimeSlot::where('start_time', $startTime)
                ->where('end_time', $endTime)
                ->where('id', '!=', $this->id) // Loại trừ chính bản ghi đang cập nhật
                ->exists();

            if ($exists) {
                $validator->errors()->add('start_time', 'Khoảng thời gian này đã tồn tại!');
            }
        });
    }
}
