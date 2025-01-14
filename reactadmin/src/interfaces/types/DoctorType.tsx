export interface TagSpecialty {
    value: string,
    label: string
}

export type DoctorPayloadInput = {
    name: string,
    user_id: string,
    description?: string,
    content?: string,
    canonical: string,
    meta_title?: string,
    meta_keyword?: string,
    meta_description?: string,
    post_catalogue_id?: string | undefined,
    publish?: string | undefined,
    follow?: string | undefined,
    image?: any,
    tags?: TagSpecialty[],
    specialties?: TagSpecialty[]

};

export type DoctorPayloadForSubmit = Omit<DoctorPayloadInput, 'tags' | 'specialties'> & {
    tags?: string[],
    specialties?: string[]
}

export type Doctor = {
    [key: string]: string
}