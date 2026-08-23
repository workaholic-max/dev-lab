import type { NavigationGuardWithThis } from 'vue-router';

import { resolveGuards } from '../../router-guards/index.ts';
import { lastVisitedRoute, type StoredRoute } from '../../last-visited-route/last-visited-route.ts';

import router from '../router.ts'; // however the app creates its router instance
import { useAuthStore } from '@/stores/auth.store';

export const onBeforeEach: NavigationGuardWithThis<undefined> = (to, from) => {
    if (to.name === from.name) return;

    const authStore = useAuthStore();

    const isRouteReachable = (route: StoredRoute): boolean => {
        if (!router.hasRoute(route.name)) return false;

        const resolvedRoute = router.resolve({
            name: route.name,
            params: route.params
        });

        return resolveGuards({ to: resolvedRoute, user: authStore.user }) === null;
    };

    const lastVisited = lastVisitedRoute.get(to, isRouteReachable);

    if (lastVisited !== undefined) {
        return lastVisited;
    }

    return resolveGuards({ to, user: authStore.user });
};
