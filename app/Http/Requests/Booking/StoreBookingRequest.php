<?php

namespace App\Http\Requests\Booking;

use Illuminate\Foundation\Http\FormRequest;

class StoreBookingRequest extends FormRequest
{
    /**
     * Determine if the Booking is authorized to make this request.
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
            'full_name' => 'required',
            'email' => 'required|email',
            'phone' => 'required',
            'gender' => 'required',
            'birthday' => 'required',
            'method' => 'required',
            'total_price' => 'required',
        ];
    }

    public function messages(): array
    {
        return [
            'full_name.required' => 'Bạn chưa nhập vào Họ tên!',
            'email.required' => 'Bạn chưa nhập vào Email!',
            'email.email' => 'Email chưa đúng định dạng! Ví dụ: abc@gmail.com',
            'phone.required' => 'Bạn chưa nhập vào số điện thoại',
            'gender.required' => 'Bạn chưa chọn giới tính',
            'birthday.required' => 'Bạn chưa nhập ngày tháng năm sinh',
            'method.required' => 'Bạn chưa chọn hình thức thanh toán',
            'total_price.required' => 'Chưa có tổng giá tiền đơn đặt lịch khám bệnh',
        ];
    }
}
