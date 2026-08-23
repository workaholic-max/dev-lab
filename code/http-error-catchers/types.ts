export const HTTP_STATUS_CODES = {
    INTERNAL_SERVER_ERROR: 500,

    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
} as const;

export const HTTP_STATUS_CODE_VALUES = Object.values(HTTP_STATUS_CODES);

export type HttpStatusCode = (typeof HTTP_STATUS_CODES)[keyof typeof HTTP_STATUS_CODES];
export type ValidationErrors = Record<string, string[]>;

export interface HttpBackendError {
    response: {
        status: HttpStatusCode;
        data: {
            message: string;
            errors?: ValidationErrors;
        };
    };
}
