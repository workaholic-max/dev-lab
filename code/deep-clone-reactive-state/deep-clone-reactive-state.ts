import { isProxy, isReactive, isRef, toRaw } from 'vue';

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
    Object.prototype.toString.call(value) === '[object Object]';

export const deepToRaw = <T>(value: T): T => {
    if (isRef(value)) {
        return deepToRaw(value.value) as T;
    }

    if (isReactive(value) || isProxy(value)) {
        return deepToRaw(toRaw(value)) as T;
    }

    if (Array.isArray(value)) {
        return value.map((item) => deepToRaw(item)) as unknown as T;
    }

    if (value instanceof Map) {
        return new Map(Array.from(value, ([key, item]) => [deepToRaw(key), deepToRaw(item)])) as unknown as T;
    }

    if (value instanceof Set) {
        return new Set(Array.from(value, (item) => deepToRaw(item))) as unknown as T;
    }

    if (isPlainObject(value)) {
        return Object.fromEntries(Object.entries(value).map(([key, nestedValue]) => [key, deepToRaw(nestedValue)])) as T;
    }

    return value;
};

export const cloneRaw = <T>(value: T): T => structuredClone(deepToRaw(value));
