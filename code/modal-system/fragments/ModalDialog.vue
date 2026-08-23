<script setup lang="ts">
// ───────────────────────────────────────────────────────
// Props
// ───────────────────────────────────────────────────────

const { title } = defineProps<{
    title: string;
}>();

// ───────────────────────────────────────────────────────
// Slots
// ───────────────────────────────────────────────────────

const slots = defineSlots<{
    content?: () => unknown;
    actions: () => unknown;
}>();
</script>

<template>
    <div
        class="ml-modal-dialog relative mx-auto mb-0 flex w-full max-w-full flex-col gap-12 break-words rounded-t-lg bg-white p-6 sm:mb-auto sm:max-w-sm sm:rounded-lg sm:p-6"
        @click.stop
    >
        <h5 class="text-center">{{ title }}</h5>

        <div
            v-if="slots['content']"
            class="min-h-0"
        >
            <slot name="content" />
        </div>

        <div
            class="flex flex-col-reverse items-center justify-center gap-4 sm:flex-row [&>button]:w-full [&>button]:flex-auto sm:[&>button]:w-auto sm:[&>button]:flex-1 sm:[&>button]:basis-[calc(50%-0.5rem)]"
        >
            <slot name="actions" />
        </div>
    </div>
</template>

<style scoped>
.ml-modal-dialog {
    padding-bottom: max(1.5rem, env(safe-area-inset-bottom));
}

@supports (-webkit-overflow-scrolling: touch) {
    .ml-modal-dialog {
        padding-bottom: 1.5rem;
    }
}
</style>
