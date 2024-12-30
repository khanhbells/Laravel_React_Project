export type UserCataloguePayloadInput = {
    name: string,
    description?: string | undefined,
};
export type UserCatalogue = {
    id: number,
    name: string,
    description: string,
    users_count: string,
}