import axios from "@/configs/axios";
import { handleAxiosError } from "@/helper/axiosHelper";

interface GeminiResponse {
    // candidates?: { content: { parts: { text: string }[] } }[];
    bot_response: string
}

const callGeminiAPI = async (
    message: string
): Promise<GeminiResponse | string> => {
    try {
        const res = await axios.post<GeminiResponse>("/gemini", { message });
        return res.data;
    } catch (error) {
        console.error("Lỗi gọi Gemini API:", error);
        return "Lỗi kết nối API";
    }
};

const trainData = async () => {
    try {
        const response = await axios.get(`/trainData`);
        return response.data;
    } catch (error: any) {
        handleAxiosError(error);
        return {
            code: error?.response.status,
            message: "Không có quyền truy cập",
        };
    }
};

export { callGeminiAPI, trainData };
