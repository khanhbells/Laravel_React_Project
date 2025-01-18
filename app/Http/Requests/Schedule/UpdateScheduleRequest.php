<?php

namespace App\Http\Requests\Schedule;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;

class UpdateScheduleRequest extends FormRequest
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
            'date' => [
                'required',
                'date',
                function ($attribute, $value, $fail) {
                    $doctorId = $this->input('doctor_id');
                    $date = $this->input('date');
                    $timeSlotId = $this->input('time_slot_id');
                    $scheduleId = $this->input('id'); // ID của lịch khám hiện tại

                    // Lấy thông tin lịch khám hiện tại từ cơ sở dữ liệu
                    $currentSchedule = DB::table('schedules')->where('id', $scheduleId)->first();

                    // Kiểm tra nếu dữ liệu không thay đổi, bỏ qua kiểm tra trùng lặp
                    if (
                        $currentSchedule &&
                        $currentSchedule->date === $value &&
                        $currentSchedule->doctor_id == $doctorId &&
                        $currentSchedule->time_slot_id == $timeSlotId &&
                        $currentSchedule->date == $date
                    ) {
                        return; // Bỏ qua kiểm tra nếu dữ liệu không thay đổi
                    }

                    // Thực hiện kiểm tra trùng lặp
                    $exists = DB::table('schedules')
                        ->where('doctor_id', $doctorId)
                        ->where('date', $value)
                        ->where('time_slot_id', $timeSlotId)
                        ->where('id', '!=', $scheduleId) // Loại trừ lịch khám hiện tại
                        ->exists();

                    if ($exists) {
                        $fail('Lịch khám đã tồn tại với ngày và giờ khám này.');
                    }
                },
            ],

        ];
    }

    public function messages(): array
    {
        return [
            'date.required' => 'Vui lòng chọn ngày khám bệnh.',
            'date.date' => 'Ngày khám bệnh không hợp lệ.',
        ];
    }
}
