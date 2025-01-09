export type TTag = {
    id: number,
    name: string,
    canonical: string,
    posts_count: string,
}
export type TTagPayloadInput = {
    name: string,
    canonical: string
};