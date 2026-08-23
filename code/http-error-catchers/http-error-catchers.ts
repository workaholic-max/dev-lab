import { HTTP_STATUS_CODES, type ValidationErrors } from './types';
import { isHttpBackendError } from './utils';

export const catchForbiddenError = (error: unknown, callback: (message: string) => void) => {
    if (!isHttpBackendError(error)) return;

    const { status, data } = error.response;

    if (status === HTTP_STATUS_CODES.FORBIDDEN) {
        callback(data.message);
    }
};

export const catchNotFoundError = (error: unknown, callback: () => void) => {
    if (!isHttpBackendError(error)) return;

    const { status } = error.response;

    if (status === HTTP_STATUS_CODES.NOT_FOUND) {
        callback();
    }
};

export const catchUnprocessableEntityError = (error: unknown, callback: (errors: ValidationErrors) => void) => {
    if (!isHttpBackendError(error)) return;

    const { status, data } = error.response;

    if (status === HTTP_STATUS_CODES.UNPROCESSABLE_ENTITY) {
        callback(data.errors ?? {});
    }
};
