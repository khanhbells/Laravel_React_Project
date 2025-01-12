export interface Tag {
    value: string,
    label: string
}

export type SpecialtyPayloadInput = {
    name: string,
    description?: string,
    content?: string,
    canonical: string,
    meta_title?: string,
    meta_keyword?: string,
    meta_description?: string,
    publish?: string | undefined,
    follow?: string | undefined,
    image?: any,
    icon?: any,
    tags?: Tag[],
};
export type Specialty = {
    [key: string]: string
}

export type SpecialtyPayloadForSubmit = Omit<SpecialtyPayloadInput, 'tags'> & {
    tags?: string[]
}
