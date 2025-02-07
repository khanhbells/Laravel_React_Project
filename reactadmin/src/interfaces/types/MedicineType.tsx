export interface Tag {
    value: string,
    label: string
}

export type MedicinePayloadInput = {
    name: string,
    description?: string,
    content?: string,
    canonical: string,
    meta_title?: string,
    meta_keyword?: string,
    meta_description?: string,
    medicine_catalogue_id?: string | undefined,
    publish?: string | undefined,
    follow?: string | undefined,
    image?: any,
    icon?: any,
    catalogues?: string,
    tags?: Tag[]
};

export type MedicinePayloadForSubmit = Omit<MedicinePayloadInput, 'tags'> & {
    tags?: string[]
}

export type Medicine = {
    [key: string]: string
}