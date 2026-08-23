import { ref } from 'vue';
import { defineStore } from 'pinia';

import { TOAST_TYPES, type ToastType, type Toast } from './types.ts';

export const useToastStore = defineStore('toast', () => {
    const pendingTimeouts = new Map<number, ReturnType<typeof setTimeout>>();

    const toasts = ref<Toast[]>([]);

    let lastToastId = 0;

    const show = (type: ToastType, message: string) => {
        const id = lastToastId++;

        toasts.value.push({ id, type, message });

        pendingTimeouts.set(
            id,
            setTimeout(() => hide(id), 3000) // 3s
        );
    };

    const showInfo = (message: string) => show(TOAST_TYPES.INFO, message);
    const showSuccess = (message: string) => show(TOAST_TYPES.SUCCESS, message);
    const showFail = (message: string) => show(TOAST_TYPES.FAIL, message);

    const hide = (id: number) => {
        const timeoutId = pendingTimeouts.get(id);

        if (!timeoutId) return;

        clearTimeout(timeoutId);

        pendingTimeouts.delete(id);

        toasts.value = toasts.value.filter((toast) => toast.id !== id);
    };

    return {
        toasts,
        showInfo,
        showSuccess,
        showFail,
        hide,
    };
});
