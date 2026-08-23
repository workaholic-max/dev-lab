<script setup lang="ts">
import { computed } from 'vue';

import type { IconName } from './registry.ts';
import { BACKGROUND_IMAGE_ICONS } from './registry.ts';

const { name, size = 24 } = defineProps<{
    name: IconName;
    size?: number;
}>();

// ───────────────────────────────────────────────────────
// Icon state
// ───────────────────────────────────────────────────────

const iconClass = computed(() => [
    `ml-icon--${name}`,
    {
        'ml-icon--bg-img': BACKGROUND_IMAGE_ICONS.includes(name),
    },
]);

const iconStyle = computed(() => ({
    '--icon-size-base': `${size}px`,
}));
</script>

<template>
    <div
        class="ml-icon"
        :class="iconClass"
        :style="iconStyle"
    />
</template>

<style>
.ml-icon {
    --icon-url: none;
    --icon-size: var(--icon-size-base);
    --icon-color: currentColor;

    flex-shrink: 0;
    width: var(--icon-size);
    height: var(--icon-size);

    &:not(&--bg-img) {
        background-color: var(--icon-color);
        mask-image: var(--icon-url);
        mask-repeat: no-repeat;
        mask-position: center;
        mask-size: contain;
        -webkit-mask-image: var(--icon-url);
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-position: center;
        -webkit-mask-size: contain;
        transition: background-color 300ms ease;
    }

    &--bg-img {
        background-image: var(--icon-url);
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
    }

    /* One rule per registered icon, mapping name -> asset. */
    &--arrow {
        --icon-url: url('@/assets/icons/arrow.svg');
    }

    &--checklist {
        --icon-url: url('@/assets/icons/checklist.svg');
    }

    &--edit {
        --icon-url: url('@/assets/icons/edit.svg');
    }

    &--user {
        --icon-url: url('@/assets/icons/user.svg');
    }

    /* ...remaining icons follow the same pattern. */
}
</style>
