<script setup lang="ts">
import { useAppReloadStore } from './app-reload.store.ts';
import FullScreenOverlay from './FullScreenOverlay.vue';

const appReloadStore = useAppReloadStore();
</script>

<template>
    <FullScreenOverlay v-if="appReloadStore.isOverlayVisible" />
</template>
