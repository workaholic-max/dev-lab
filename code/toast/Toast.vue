<script setup lang="ts">
import { TOAST_TYPES } from './types.ts';
import { useToastStore } from './toast.store.ts';

const toastStore = useToastStore();
</script>

<template>
    <!-- z-[60] is deliberately above modal-system's Dialog (z-50) — a toast
         triggered from inside an open modal should still show on top of it. -->
    <div class="pointer-events-none fixed right-4 top-4 z-[60] flex w-72 flex-col gap-2">
        <transition-group name="toast">
            <button
                v-for="toast in toastStore.toasts"
                :key="toast.id"
                type="button"
                class="pointer-events-auto rounded-md px-4 py-3 text-left text-sm text-white shadow-lg"
                :class="{
                    'bg-gray-800': toast.type === TOAST_TYPES.INFO,
                    'bg-green-600': toast.type === TOAST_TYPES.SUCCESS,
                    'bg-red-600': toast.type === TOAST_TYPES.FAIL,
                }"
                @click="toastStore.hide(toast.id)"
            >
                {{ toast.message }}
            </button>
        </transition-group>
    </div>
</template>

<style>
.toast-enter-from,
.toast-leave-to {
    @apply translate-x-2 opacity-0;
}

.toast-enter-active,
.toast-leave-active {
    @apply transition-[transform,opacity] duration-150 ease-out;
}
</style>
