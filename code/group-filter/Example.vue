<script setup lang="ts">
import { computed, ref } from 'vue';

import type { GroupOption } from './types.ts';

import GroupFilter from './GroupFilter.vue';

// ───────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────

interface Item {
    id: number;
    name: string;
    groupName: string;
}

// ───────────────────────────────────────────────────────
// Search
// ───────────────────────────────────────────────────────

const searchQuery = ref('');

// ───────────────────────────────────────────────────────
// Items state
// ───────────────────────────────────────────────────────

const items: Item[] = [
    { id: 1, name: 'Apples', groupName: 'Produce' },
    { id: 2, name: 'Carrots', groupName: 'Produce' },
    { id: 3, name: 'Spinach', groupName: 'Produce' },
    { id: 4, name: 'Milk', groupName: 'Dairy' },
    { id: 5, name: 'Cheddar', groupName: 'Dairy' },
    { id: 6, name: 'Yogurt', groupName: 'Dairy' },
    { id: 7, name: 'Flour', groupName: 'Bakery' },
    { id: 8, name: 'Sourdough', groupName: 'Bakery' },
    { id: 9, name: 'Rice', groupName: 'Pantry' },
    { id: 10, name: 'Pasta', groupName: 'Pantry' },
];

const filteredItems = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();

    if (!query) return items;

    return items.filter((item) => item.name.toLowerCase().includes(query));
});

const visibleItems = computed(() => {
    if (activeGroup.value === null) return [];

    return filteredItems.value.filter((item) => item.groupName === activeGroup.value);
});

// ───────────────────────────────────────────────────────
// Group filter state
// ───────────────────────────────────────────────────────

const activeGroup = ref<string | null>(null);

const groupOptions = computed<GroupOption[]>(() =>
    [...new Set(items.map((item) => item.groupName))].map((groupName) => ({
        value: groupName,
        label: groupName,
    }))
);

const activeGroupValues = computed(() => new Set(filteredItems.value.map((item) => item.groupName)));
</script>

<template>
    <GroupFilter
        v-model:search-query="searchQuery"
        v-model:active-group="activeGroup"
        :group-options="groupOptions"
        :active-group-values="activeGroupValues"
    >
        <p
            v-if="visibleItems.length === 0"
            class="text-sm text-gray-500"
        >
            Nothing found
        </p>

        <ul
            v-else
            class="flex flex-col gap-2"
        >
            <li
                v-for="item in visibleItems"
                :key="item.id"
            >
                {{ item.name }}
            </li>
        </ul>
    </GroupFilter>
</template>
