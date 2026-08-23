<script setup lang="ts">
import { ref } from 'vue';
import { ArrowIcon, Icon, ICON_DIRECTIONS, ICON_NAMES } from './index.ts';

// Short, self-contained demo of the icon system's API surface —
// not a real UI, just enough to show what it can do.

const isOpen = ref(false);
</script>

<template>
    <div class="icon-example">
        <!-- default size (24px), default color -->
        <Icon :name="ICON_NAMES.EDIT" />

        <!-- explicit size, still through the public size prop -->
        <Icon
            :name="ICON_NAMES.USER"
            :size="32"
        />

        <!-- contextual color override — no prop for this, just CSS -->
        <Icon
            :name="ICON_NAMES.EDIT"
            class="ml-icon-example__accent"
        />

        <!-- background-image mode: multicolor, but --icon-color has no effect here -->
        <Icon :name="ICON_NAMES.CHECKLIST" />

        <!-- directional icon, static -->
        <ArrowIcon :direction="ICON_DIRECTIONS.UP" />

        <!-- directional icon, driven by component state -->
        <ArrowIcon :direction="isOpen ? ICON_DIRECTIONS.UP : ICON_DIRECTIONS.DOWN" />
    </div>
</template>

<style scoped>
.ml-icon-example {
    &__accent {
        --icon-color: #2f6fed;
    }
}
</style>
