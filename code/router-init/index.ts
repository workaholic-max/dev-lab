import type { App } from 'vue';

import router from './router.ts'; // however the app creates its router instance

import { onBeforeEach } from './fragments/before-each.ts';
import { onAfterEach } from './fragments/after-each.ts';
import { onRouterError } from './fragments/on-error.ts';

export const initRouter = (app: App) => {
    router.beforeEach(onBeforeEach);
    router.afterEach(onAfterEach);
    router.onError(onRouterError);

    app.use(router);
};
