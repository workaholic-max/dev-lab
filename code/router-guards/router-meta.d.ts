declare module 'vue-router' {
    interface RouteMeta {
        title: string;
        permissionKey?: string;
        ignoreLastVisited?: boolean;
    }
}

export {};
