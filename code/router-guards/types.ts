import type { RouteLocationNormalized, RouteLocationRaw } from 'vue-router';

// GuardResult is the whole contract:
// null   -> not my concern, keep checking the rest
// true   -> hard accept, stop checking, let navigation proceed
// object -> redirect here instead
export type GuardResult = null | true | RouteLocationRaw;

export type Guard<Context> = (context: Context) => GuardResult;

export interface User {
    permissions: Record<string, boolean>;
}

export interface Context {
    to: RouteLocationNormalized;
    user: User | null;
}
