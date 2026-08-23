# HTTP error catchers

Named `.catch()` helpers for HTTP statuses that need specific handling, replacing repeated `if (error.response?.status === 422) { ... }` checks at each request call site.

## How it works

Each helper accepts `unknown`, narrows it with `isHttpBackendError`, and invokes its callback only when `response.status` matches. The same caught value can therefore be passed to several helpers in sequence; mismatched helpers do nothing, so only the callback for the matching status runs.

`isHttpBackendError` rejects primitives, `null`, and arrays; requires object-shaped `response` and `response.data` values; and accepts only statuses declared in `HTTP_STATUS_CODES`. Once those checks pass, the data is trusted to follow the backend contract: a required message and optional validation errors. This intentionally avoids validating every payload field at runtime, at the cost that an unrelated object imitating a recognized response status and data shape can pass the guard.

```ts
apiClient.request({ method: 'post', url: '/employees', data: payload }).catch((error) => {
    catchUnprocessableEntityError(error, (errors) => formActions.setValidationErrors(errors));
    catchNotFoundError(error, () => showMissingEmployeeState());
    catchForbiddenError(error, (message) => showErrorToUser(message));
});
```

## Why a callback instead of returning the extracted data

Returning extracted data would make every caller check whether a helper matched before using the result. A callback keeps that branching inside the helper: callers list the handlers that matter, and each callback runs only for its own status. `catchUnprocessableEntityError` also normalizes missing validation errors to `{}`, so its callback always receives a `ValidationErrors` record rather than `undefined`.

## Files

`types.ts` defines the supported status codes and backend error contract. `utils.ts` owns the runtime narrowing from `unknown` to that contract. `http-error-catchers.ts` contains the status-specific callback helpers that use both.
