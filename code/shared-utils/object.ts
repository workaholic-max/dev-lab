import type { Nullable } from '../shared-types/types.ts';

export const isObject = (value: unknown): value is Record<string, unknown> =>
    Object.prototype.toString.call(value) === '[object Object]';

export const getNestedObjectValue = <T>(source: Record<string, unknown>, path: string[]): Nullable<T> => {
    const result = path.reduce<unknown>((state, fieldName) => {
        if (isObject(state)) {
            return state[fieldName];
        }

        return null;
    }, source);

    return result as Nullable<T>;
};

export const setNestedObjectValue = <T>(source: Record<string, unknown>, path: string[], value: T) => {
    const localPath = [...path];
    const lastKey = localPath.pop();

    if (lastKey === undefined) return;

    const target = localPath.reduce<Record<string, unknown>>((state, fieldName) => {
        if (!isObject(state[fieldName])) {
            state[fieldName] = {};
        }

        return state[fieldName] as Record<string, unknown>;
    }, source);

    target[lastKey] = value;
};

export const extractFields = <T extends Record<string, unknown>, K extends keyof T>(
    obj: T | null | undefined,
    keys: K[]
): Pick<T, K> | null => {
    if (!obj) return null;

    return keys.reduce((acc, key) => {
        if (key in obj) {
            acc[key] = obj[key];
        }

        return acc;
    }, {} as Pick<T, K>);
};
