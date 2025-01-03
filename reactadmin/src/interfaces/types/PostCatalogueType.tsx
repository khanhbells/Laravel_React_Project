export type PostCataloguePayloadInput = {
    name: string,
    description?: string,
    content?: string,
    canonical: string,
    meta_title?: string,
    meta_keyword?: string,
    meta_description?: string,
    parent_id?: string
};
export type PostCatalogue = {
    id: number,
    name: string,
    description: string,
    posts_count: string,
}