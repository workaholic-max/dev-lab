import { ref } from 'vue';
import { defineStore } from 'pinia';

import { bodyScrollControl } from '../body-scroll-control/body-scroll.js';
import { bodyInteractionControl } from '../body-interaction-control/body-interaction.js';

// ───────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────

export interface TriggerOptions {
    href?: string;
}

// ───────────────────────────────────────────────────────
// Implementation
// ───────────────────────────────────────────────────────

export const useAppReloadStore = defineStore('appReload', () => {
    const isOverlayVisible = ref(false);

    const trigger = (options: TriggerOptions = {}) => {
        isOverlayVisible.value = true;

        bodyScrollControl.lock();
        bodyInteractionControl.lock();

        setTimeout(() => {
            if (options.href) {
                window.location.assign(options.href);
            } else {
                window.location.reload();
            }
        }, 2000); // 2s
    };

    return {
        isOverlayVisible,
        trigger,
    };
});
