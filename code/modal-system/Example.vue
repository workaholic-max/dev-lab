<script setup lang="ts">
import { ref } from 'vue';

import Modal from './index.js';

const isOpened = ref(false);
</script>

<template>
    <button
        type="button"
        @click="isOpened = true"
    >
        Open info modal
    </button>

    <Modal.Overlay
        :is-opened="isOpened"
        @close="isOpened = false"
    >
        <Modal.Dialog title="Heads up">
            <template #content> This is the raw modal system — just Overlay + Dialog, no extra behavior. </template>

            <template #actions>
                <button
                    type="button"
                    @click="isOpened = false"
                >
                    Got it
                </button>
            </template>
        </Modal.Dialog>
    </Modal.Overlay>
</template>
