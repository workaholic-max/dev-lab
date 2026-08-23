import type { RouteLocationNormalized } from 'vue-router';

import { localStorageService } from '../local-storage-service/local-storage.service.ts';

// ───────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────

export interface StoredRoute {
    name: string;
    params: Record<string, string>;
}

// ───────────────────────────────────────────────────────
// Implementation
// ───────────────────────────────────────────────────────

const STORAGE_KEY = 'router.lastVisited';

let isFirstNavigation = true;

const get = (
    to: RouteLocationNormalized,
    isRouteReachable: (route: StoredRoute) => boolean
): StoredRoute | undefined => {
    if (!isFirstNavigation) return;

    isFirstNavigation = false;

    if (to.path !== '/') return;

    const lastVisited = localStorageService.get<StoredRoute>(STORAGE_KEY);

    if (lastVisited === null) return;

    if (!isRouteReachable(lastVisited)) {
        localStorageService.remove(STORAGE_KEY);

        return;
    }

    return lastVisited;
};

const set = (route: RouteLocationNormalized): void => {
    if (route.meta.ignoreLastVisited) return;

    localStorageService.set<StoredRoute>(STORAGE_KEY, {
        name: route.name,
        params: route.params,
    });
};

export const lastVisitedRoute = {
    get,
    set,
};
