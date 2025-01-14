export type Patient = {
    id: number,
    name: string,
    email: string,
    image: string | null,
    phone: string | null,
    address: string | null,
    created_at: string | null,
    patient_catalogue_id: string,
    province_id: string | null,
    district_id: string | null,
    ward_id: string | null,
    birthday: string | null,
    patient_catalogues?: string | null,
}
export type PayloadInput = {
    name: string,
    email: string,
    phone: string,
    password?: string | undefined,
    confirmPassword?: string | undefined,
    birthday?: string,
    patient_catalogue_id: string,
    province_id: string,
    district_id: string,
    ward_id: string,
    image?: any,
    address?: string
};