<?php

namespace App\Http\Requests\Gemini;

use Illuminate\Foundation\Http\FormRequest;

class StoreGeminiRequest extends FormRequest
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
            'user_message' => 'required',
            'bot_response' => 'required',
        ];
    }
    public function messages(): array
    {
        return [
            'user_message.required' => 'Bạn phải nhập vào câu hỏi',
            'bot_response.required' => 'Gemini không phản hồi',
        ];
    }
}
