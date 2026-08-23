import type { Nullable } from '../shared-types/types.ts';

const getPrefixedKey = (key: string) => `ml.app.${key}`;

const get = <T>(key: string, defaultValue: Nullable<T> = null): Nullable<T> => {
    const value = window.localStorage.getItem(getPrefixedKey(key));

    if (value === null) {
        return defaultValue;
    }

    try {
        return JSON.parse(value) as T;
    } catch {
        return defaultValue;
    }
};

const set = <T>(key: string, value: T) => {
    try {
        window.localStorage.setItem(getPrefixedKey(key), JSON.stringify(value));
    } catch {
        // Best-effort write: ignore failures such as exceeded quota or disabled storage.
    }
};

const remove = (key: string) => {
    window.localStorage.removeItem(getPrefixedKey(key));
};

export const localStorageService = {
    get,
    set,
    remove,
};
