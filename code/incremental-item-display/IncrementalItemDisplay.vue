<script setup lang="ts" generic="T">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

import type { ClassName } from '../shared-types/types.ts';

// ───────────────────────────────────────────────────────
// Props
// ───────────────────────────────────────────────────────

const {
    items,
    itemKey = null,
    emptyNoteText = 'The list is empty.',
    maxHeightClassName,
    chunkSize = 20,
    listClassName,
} = defineProps<{
    items: T[];
    itemKey?: keyof T | null;
    emptyNoteText?: string;
    maxHeightClassName?: ClassName;
    chunkSize?: number;
    listClassName?: ClassName;
}>();

// ───────────────────────────────────────────────────────
// Items rendering state
// ───────────────────────────────────────────────────────

const renderedItemCount = ref(chunkSize);

const hasMoreToRender = computed(() => renderedItemCount.value < items.length);

const visibleItems = computed(() =>
    hasMoreToRender.value ? items.slice(0, renderedItemCount.value) : items
);

watch(
    () => items.length,
    () => {
        renderedItemCount.value = chunkSize;

        nextTick(renderVisibleChunks);
    }
);

// ───────────────────────────────────────────────────────
// Incremental rendering
// ───────────────────────────────────────────────────────

const OBSERVER_OFFSET = 100; // px

let observer: IntersectionObserver | null = null;
let isListRendering = false;

const scrollRootRef = ref<HTMLElement | null>(null);
const sentinelRef = ref<HTMLElement | null>(null);

const hasScrollableContainer = computed(() => maxHeightClassName !== undefined);

const scrollableElRoot = computed<HTMLElement | null>(() => hasScrollableContainer.value ? scrollRootRef.value : null);

const isSentinelVisible = (): boolean => {
    if (!sentinelRef.value) return false;

    const rect = sentinelRef.value.getBoundingClientRect();

    const rootEl = scrollableElRoot.value;
    const rootBottom = rootEl ? rootEl.getBoundingClientRect().bottom : window.innerHeight;

    return rect.top <= rootBottom + OBSERVER_OFFSET;
};

const renderVisibleChunks = async () => {
    if (isListRendering) return;

    isListRendering = true;

    while (hasMoreToRender.value && isSentinelVisible()) {
        renderedItemCount.value += chunkSize;

        await nextTick();
    }

    isListRendering = false;
};

const disconnectObserver = () => {
    if (observer === null) return;

    observer.disconnect();
    observer = null;
};

const createObserver = () => {
    if (observer !== null) return;

    observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                renderVisibleChunks();
            }
        },
        {
            root: scrollableElRoot.value,
            rootMargin: `${OBSERVER_OFFSET}px`,
        }
    );

    if (sentinelRef.value !== null) {
        observer.observe(sentinelRef.value);
    }
};

watch(sentinelRef, (el) => {
    if (el) {
        createObserver();
    } else {
        disconnectObserver();
    }
});

onBeforeUnmount(disconnectObserver);
</script>

<template>
    <div
        v-if="items.length > 0"
        ref="scrollRootRef"
        :class="hasScrollableContainer && ['-mr-2 overflow-y-auto pr-2', maxHeightClassName]"
    >
        <div :class="['relative', listClassName]">
            <template
                v-for="(item, index) in visibleItems"
                :key="itemKey ? String(item[itemKey]) : index"
            >
                <slot
                    name="item"
                    :item="item"
                    :index="index"
                />
            </template>

            <div
                v-if="hasMoreToRender"
                ref="sentinelRef"
                aria-hidden="true"
                class="pointer-events-none absolute inset-x-0 bottom-0 h-px"
            />
        </div>
    </div>

    <p
        v-else
        class="pt-4 text-center font-light text-gray-500"
    >
        {{ emptyNoteText }}
    </p>
</template>
