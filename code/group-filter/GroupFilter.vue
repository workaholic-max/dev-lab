<script setup lang="ts">
import { computed, watch } from 'vue';

import type { GroupOption } from './types.ts';

// ───────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────

interface ResolvedGroupOption extends GroupOption {
    isDisabled: boolean;
}

// ───────────────────────────────────────────────────────
// Component API
// ───────────────────────────────────────────────────────

const {
    groupOptions,
    activeGroupValues,
} = defineProps<{
    groupOptions: GroupOption[];
    activeGroupValues: Set<string>;
}>();

// ───────────────────────────────────────────────────────
// Search
// ───────────────────────────────────────────────────────

const searchQuery = defineModel<string>('searchQuery', { default: '' });

// ───────────────────────────────────────────────────────
// Active group
// ───────────────────────────────────────────────────────

const activeGroup = defineModel<string | null>('activeGroup', { default: null });

const isActiveGroupContentReady = computed(() => activeGroup.value !== null || activeGroupValues.size === 0);

const isGroupOptionActive = (groupOption: GroupOption) => activeGroup.value === groupOption.value;

const setActiveGroup = (groupOption: ResolvedGroupOption) => {
    if (groupOption.isDisabled) return;

    activeGroup.value = groupOption.value;
};

// ───────────────────────────────────────────────────────
// Group options
// ───────────────────────────────────────────────────────

const sortedGroupOptions = computed<ResolvedGroupOption[]>(() => {
    const options = groupOptions.map((groupOption) => ({
        ...groupOption,
        isDisabled: !activeGroupValues.has(groupOption.value),
    }));

    if (activeGroupValues.size > 0) {
        options.sort((a, b) => {
            if (a.isDisabled === b.isDisabled) return 0;

            return a.isDisabled ? 1 : -1;
        });
    }

    return options;
});

watch(
    () => activeGroupValues,
    (activeValues) => {
        if (activeGroup.value !== null && activeValues.has(activeGroup.value)) return;

        activeGroup.value = activeValues.values().next().value ?? null;
    },
    { immediate: true }
);
</script>

<template>
    <div class="flex flex-1 flex-col gap-4">
        <div class="flex flex-col gap-4 rounded-full bg-white">
            <input
                v-model="searchQuery"
                type="search"
                placeholder="Search…"
                class="w-full rounded-full border border-gray-200 px-4 py-2 text-sm"
            />

            <div
                v-if="groupOptions.length > 0"
                class="-mx-4 overflow-x-auto px-4"
            >
                <div class="flex w-max gap-1.5">
                    <button
                        v-for="groupOption in sortedGroupOptions"
                        :key="groupOption.value"
                        type="button"
                        :disabled="groupOption.isDisabled"
                        class="min-w-[75px] shrink-0 rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-center text-sm transition-colors select-none disabled:cursor-not-allowed disabled:opacity-50"
                        :class="{
                            'border-primary-300 bg-primary-50': isGroupOptionActive(groupOption),
                            'hover:bg-primary-50': !groupOption.isDisabled
                        }"
                        @click="setActiveGroup(groupOption)"
                    >
                        {{ groupOption.label }}
                    </button>
                </div>
            </div>
        </div>

        <div
            v-if="isActiveGroupContentReady"
            class="flex flex-col"
        >
            <slot />
        </div>
    </div>
</template>
