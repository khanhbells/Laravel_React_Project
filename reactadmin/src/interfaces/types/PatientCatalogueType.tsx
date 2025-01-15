export type PatientCataloguePayloadInput = {
    name: string,
    description?: string | undefined,
};
export type PatientCatalogue = {
    id: number,
    name: string,
    description: string,
    patients_count: string,
    patient_catalogue_permissions?: number[]
}