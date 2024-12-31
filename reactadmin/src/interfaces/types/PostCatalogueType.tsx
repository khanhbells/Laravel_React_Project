export type PostCataloguePayloadInput = {
    name: string,
    description?: string | undefined,
};
export type PostCatalogue = {
    id: number,
    name: string,
    description: string,
    posts_count: string,
}