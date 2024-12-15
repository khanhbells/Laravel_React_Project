export type User = {
    id: number,
    name: string,
    email: string,
    image: string | null,
    phone: string | null,
    address: string | null,
    created_at: string | null
}
export type PayloadInput = {
    name: string,
    email: string,
    phone: string,
    password: string,
    re_password: string,
    birthday: string,
    user_catalogue_id: string,
    province_id: string,
    district_id: string,
    ward_id: string,
    image: File
};