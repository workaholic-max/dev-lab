import { onBeforeUnmount } from 'vue';
import axios from 'axios';

import type { AbortablePromise } from '../axios-api-client/client.ts';
import type { Nullable } from '../shared-types/types.ts';

export const useAbortableRequest = () => {
    const requests = new Map<number, AbortablePromise<unknown>>();

    let lastRequestId = 0;

    const sendAbortableRequest = <T>(request: AbortablePromise<T>): Promise<Nullable<T>> => {
        const requestId = lastRequestId++;

        requests.set(requestId, request);

        return request
            .catch((error) => {
                if (axios.isCancel(error)) {
                    return null;
                }

                throw error;
            })
            .finally(() => requests.delete(requestId));
    };

    const abortRequests = () => {
        requests.forEach((request) => request.abort());

        requests.clear();
    };

    onBeforeUnmount(abortRequests);

    return { sendAbortableRequest, abortRequests };
};
