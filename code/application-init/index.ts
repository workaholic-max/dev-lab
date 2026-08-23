import type { App } from 'vue';

import { initRouter } from '../router-init/index.ts';
import { initPackages } from './fragments/packages.js';
import { initPinia } from './fragments/pinia.ts';
import { initServices } from './fragments/services.ts';

export const initApp = (app: App) => {
    initPinia(app);
    initRouter(app);
    initPackages();
    initServices();
};
