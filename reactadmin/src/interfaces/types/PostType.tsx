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
    catalogues?: string
};
export type Post = {
    [key: string]: string
}