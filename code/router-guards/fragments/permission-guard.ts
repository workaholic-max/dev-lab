import type { Guard, Context } from '../types.ts';
import { ROUTE_NAMES } from '../route-names.ts';

export const permissionGuard: Guard<Context> = ({ to, user }) => {
    if (user === null) return null;

    const { permissionKey } = to.meta;

    if (permissionKey && !user.permissions[permissionKey]) {
        return {
            name: ROUTE_NAMES.ACCESS_DENIED,
            query: { from: to.path }
        };
    }

    return null;
};
