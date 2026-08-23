import { computed, ref } from 'vue';
import { defineStore } from 'pinia';

import type { Nullable } from '../shared-types/types.ts';

import { DEVICE_TYPES } from './device.ts';
import type { DeviceType } from './device.ts';

export const useDeviceTypeStore = defineStore('deviceType', () => {
    const deviceType = ref<Nullable<DeviceType>>(null);

    const isMobile = computed(() => deviceType.value === DEVICE_TYPES.MOBILE);
    const isTablet = computed(() => deviceType.value === DEVICE_TYPES.TABLET);
    const isDesktop = computed(() => deviceType.value === DEVICE_TYPES.DESKTOP);

    const set = (value: DeviceType) => {
        deviceType.value = value;
    };

    return {
        isMobile,
        isTablet,
        isDesktop,
        set,
    };
});
