<script setup lang="ts">
import { computed } from 'vue';

import { useResolvedRoutes } from './use-resolved-routes.ts';

const { getResolvedMeta } = useResolvedRoutes();

const MAIN_NAVIGATION = ['dashboard.index', 'employees.index', 'settings.index'];

const navigationItems = computed(() =>
    MAIN_NAVIGATION.map((routeName) => ({
        name: routeName,
        title: getResolvedMeta(routeName).title,
    }))
);
</script>

<template>
    <router-link
        v-for="{ name, title } in navigationItems"
        :key="name"
        :to="{ name }"
    >
        {{ title }}
    </router-link>
</template>
