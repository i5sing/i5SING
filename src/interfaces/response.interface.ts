export interface IResponse<T extends any> {
    code: number;
    data: T;
    message: string;
    success: boolean;
}
