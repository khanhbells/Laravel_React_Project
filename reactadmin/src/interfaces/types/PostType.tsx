export interface Tag {
    value: string,
    label: string
}

export type PostPayloadInput = {
    name: string,
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
    icon?: any,
    catalogues?: string,
    tags?: Tag[]
};

export type PostPayloadForSubmit = Omit<PostPayloadInput, 'tags'> & {
    tags?: string[]
}

export type Post = {
    [key: string]: string
}