import axios from "@/configs/axios";
import { handleAxiosError } from "@/helper/axiosHelper";

const statistic = async () => {
    try {
        const response = await axios.get(`statistic`);
        return response.data;
    } catch (error: any) {
        handleAxiosError(error);
        return {
            code: error?.response.status,
            message: "Không có quyền truy cập",
        };
    }
};

const chart = async (chartType: string) => {
    try {
        const response = await axios.get(`chart?chartType=${chartType}`);
        return response.data;
    } catch (error: any) {
        handleAxiosError(error);
        return {
            code: error?.response.status,
            message: "Không có quyền truy cập",
        };
    }
};

const analytics = async () => {
    try {
        const response = await axios.get(`analytics`);
        return response.data;
    } catch (error: any) {
        handleAxiosError(error);
        return {
            code: error?.response.status,
            message: "Không có quyền truy cập",
        };
    }
};

const topDoctors = async () => {
    try {
        const response = await axios.get(`topDoctors`);
        return response.data;
    } catch (error: any) {
        handleAxiosError(error);
        return {
            code: error?.response.status,
            message: "Không có quyền truy cập",
        };
    }
};

const detailAnalytics = async (doctor_id: string | number | null) => {
    try {
        const response = await axios.get(
            `detailAnalytics?doctor_id=${doctor_id}`
        );
        return response.data.responses;
    } catch (error: any) {
        handleAxiosError(error);
        return {
            code: error?.response.status,
            message: "Không có quyền truy cập",
        };
    }
};

export { statistic, chart, analytics, topDoctors, detailAnalytics };
