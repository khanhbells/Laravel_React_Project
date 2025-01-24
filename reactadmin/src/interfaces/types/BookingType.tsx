export type PayloadBookingInput = {
    doctor_id: string,
    schedule_id: string
    full_name: string;
    email: string;
    phone: string;
    gender: string;
    birthday: string;
    province_id: string;
    district_id: string;
    ward_id: string;
    address?: string;
    note?: string;
    method: string;
    price_schedule?: string;
    total_price: string
}

export type Booking = {
    doctor_id: string,
    schedule_id: string
    full_name: string;
    email: string;
    phone: string;
    gender: string;
    birthday: string;
    province_id: string;
    district_id: string;
    ward_id: string;
    address?: string;
    note?: string;
    method: string;
    price_schedule?: string;
    total_price: string;
    booking_date: string;
    status: string;
    payment_status: string;
    name_doctor: string,
    image: any,
    start_time: string,
    end_time: string,
    date: string

}