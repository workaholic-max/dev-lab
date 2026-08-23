import { useRouter, type RouteMeta } from 'vue-router';

import type { Nullable } from '../shared-types/types.ts';

// ───────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────

interface ResolvedRouteEntry {
    href: Nullable<string>;
    meta: RouteMeta;
}

// ───────────────────────────────────────────────────────
// Implementation
// ───────────────────────────────────────────────────────

const resolvedRoutesCache = new Map<string, ResolvedRouteEntry>();

export const useResolvedRoutes = () => {
    const router = useRouter();

    const getResolvedRoute = (name: string): ResolvedRouteEntry => {
        const cachedRoute = resolvedRoutesCache.get(name);

        if (cachedRoute !== undefined) {
            return cachedRoute;
        }

        let entry: ResolvedRouteEntry;

        try {
            const resolvedRoute = router.resolve({ name });

            entry = {
                href: resolvedRoute.href,
                meta: resolvedRoute.meta ?? {},
            };
        } catch {
            entry = {
                href: null,
                meta: {
                    title: name,
                },
            };
        }

        resolvedRoutesCache.set(name, entry);

        return entry;
    };

    const getResolvedMeta = (name: string) => getResolvedRoute(name).meta;
    const getResolvedHref = (name: string) => getResolvedRoute(name).href;

    return { getResolvedMeta, getResolvedHref };
};
