import type { App } from 'vue';
import { createPinia } from 'pinia';

export const initPinia = (app: App) => {
    const pinia = createPinia();

    app.use(pinia);
};
