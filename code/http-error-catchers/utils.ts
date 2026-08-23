import { HTTP_STATUS_CODE_VALUES, type HttpBackendError, type HttpStatusCode } from './types';

const isObject = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null && !Array.isArray(value);

const isHttpStatusCode = (value: unknown): value is HttpStatusCode =>
    HTTP_STATUS_CODE_VALUES.some((status) => status === value);

export const isHttpBackendError = (error: unknown): error is HttpBackendError => {
    if (!isObject(error) || !isObject(error.response) || !isObject(error.response.data)) {
        return false;
    }

    return isHttpStatusCode(error.response.status);
};
