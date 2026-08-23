import type { Guard, Context } from '../types.ts';
import { ROUTE_NAMES } from '../route-names.ts';

export const authGuard: Guard<Context> = ({ to, user }) => {
    if (user === null) {
        if (to.name === ROUTE_NAMES.LOGIN) {
            return true;
        }

        return { name: ROUTE_NAMES.LOGIN };
    }

    if (to.name === ROUTE_NAMES.LOGIN) {
        return { name: ROUTE_NAMES.DASHBOARD };
    }

    return null;
};
