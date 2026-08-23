import type { GuardResult, Context } from './types.ts';
import { authGuard } from './fragments/auth-guard.ts';
import { permissionGuard } from './fragments/permission-guard.ts';

// Order matters: auth first, so permissionGuard can assume an authenticated user.
const guards = [authGuard, permissionGuard];

export const resolveGuards = (context: Context): GuardResult => {
    for (const guard of guards) {
        const result = guard(context);

        if (result === null) continue;

        if (result === true) return true;

        return result;
    }

    return null;
};
