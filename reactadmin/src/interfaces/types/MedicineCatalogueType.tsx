export type MedicineCataloguePayloadInput = {
    name: string,
    description?: string,
    content?: string,
    canonical: string,
    meta_title?: string,
    meta_keyword?: string,
    meta_description?: string,
    parent_id?: string | undefined,
    publish?: string | undefined,
    follow?: string | undefined,
    image?: any,
    icon?: any,
    // icon?: File

};
export type MedicineCatalogue = {
    [key: string]: string
}