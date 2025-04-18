export type BaseApiResponse<T> = {
    message: string;
    statusCode: number;
    data: T | null | undefined;
}