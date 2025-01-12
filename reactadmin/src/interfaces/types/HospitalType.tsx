export interface Specialty {
    value: string,
    label: string
}

export type HospitalPayloadInput = {
    name: string,
    description?: string,
    content?: string,
    canonical: string,
    meta_title?: string,
    meta_keyword?: string,
    meta_description?: string,
    address: string,
    publish?: string | undefined,
    follow?: string | undefined,
    image?: any,
    icon?: any,
    specialties?: Specialty[],

};
export type Hospital = {
    [key: string]: string
}

export type SpecialtyPayloadForSubmit = Omit<HospitalPayloadInput, 'specialties'> & {
    specialties?: string[]
}