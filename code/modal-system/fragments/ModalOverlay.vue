<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';

import { bodyScrollControl } from '../../body-scroll-control/body-scroll.js';
import { bodyInteractionControl } from '../../body-interaction-control/body-interaction.js';

defineOptions({
    inheritAttrs: false,
});

// ───────────────────────────────────────────────────────
// Props & emits
// ───────────────────────────────────────────────────────

const {
    isOpened,
    isCloseDisabled = false,
    disableOutsideClick = false,
} = defineProps<{
    isOpened: boolean;
    isCloseDisabled?: boolean;
    disableOutsideClick?: boolean;
}>();

const emit = defineEmits<{ close: [] }>();

// ───────────────────────────────────────────────────────
// Body scroll control
// ───────────────────────────────────────────────────────

watch(
    () => isOpened,
    (opened) => {
        if (opened) {
            bodyScrollControl.lock();
        } else {
            bodyScrollControl.unlock();
        }
    },
    { immediate: true }
);

onBeforeUnmount(() => {
    if (isOpened) {
        bodyScrollControl.unlock();
    }
});

// ───────────────────────────────────────────────────────
// Body interaction control
// ───────────────────────────────────────────────────────

const isTransitioning = ref(false);

const onTransitionStart = () => {
    isTransitioning.value = true;

    bodyInteractionControl.lock();
};

const onTransitionEnd = () => {
    isTransitioning.value = false;

    bodyInteractionControl.unlock();
};

onBeforeUnmount(() => {
    if (isOpened) {
        bodyInteractionControl.unlock();
    }
});

// ───────────────────────────────────────────────────────
// Modal state
// ───────────────────────────────────────────────────────

const closeModal = () => {
    if (!isTransitioning.value && isOpened && !isCloseDisabled) {
        emit('close');
    }
};

const onClickOutside = () => {
    if (!disableOutsideClick) {
        closeModal();
    }
};

const onEscapeKeydown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
        closeModal();
    }
};

watch(
    () => isOpened,
    (opened) => {
        if (opened) {
            document.addEventListener('keydown', onEscapeKeydown);
        } else {
            document.removeEventListener('keydown', onEscapeKeydown);
        }
    },
    { immediate: true }
);

onBeforeUnmount(() => document.removeEventListener('keydown', onEscapeKeydown));
</script>

<template>
    <teleport to="body">
        <transition
            appear
            name="modal-overlay"
        >
            <div
                v-if="isOpened"
                class="fixed inset-0 z-40 bg-black/30"
            />
        </transition>

        <transition
            appear
            name="modal-dialog"
            @before-enter="onTransitionStart"
            @before-leave="onTransitionStart"
            @after-enter="onTransitionEnd"
            @after-leave="onTransitionEnd"
        >
            <!-- Backdrop click-to-close is a supplementary affordance; Escape (handled in script) is the keyboard equivalent. -->
            <!-- eslint-disable-next-line vuejs-accessibility/click-events-have-key-events, vuejs-accessibility/no-static-element-interactions -->
            <div
                v-if="isOpened"
                class="fixed inset-0 z-50 flex flex-col overflow-auto px-0 pb-0 pt-2 sm:p-6"
                @click="onClickOutside"
            >
                <slot />
            </div>
        </transition>
    </teleport>
</template>

<style>
.modal-overlay-enter-from,
.modal-overlay-leave-to {
    @apply opacity-0;
}

.modal-overlay-enter-active,
.modal-overlay-leave-active {
    @apply transition-opacity duration-150 ease-out;
}

.modal-dialog-enter-from,
.modal-dialog-leave-to {
    @apply translate-y-6 scale-[0.975] opacity-0 sm:translate-y-0;
}

.modal-dialog-enter-active,
.modal-dialog-leave-active {
    @apply transition-[opacity,transform] duration-150 ease-out;
}
</style>
