<?php

namespace App\Http\Requests\Booking;

use Illuminate\Foundation\Http\FormRequest;

class UpdateBookingRequest extends FormRequest
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
            'status' => 'required',
            'payment_status' => 'required',
        ];
    }

    public function messages(): array
    {
        return [
            'status.required' => 'Trạng thái đơn đặt lịch khám trống!',
            'payment_status.required' => 'Trạng thái thanh toán trống!',
        ];
    }
}
