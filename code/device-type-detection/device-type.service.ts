import type { Nullable } from '../shared-types/types.ts';

import { useDeviceTypeStore } from './device-type.store.ts';
import { DEVICE_TYPES } from './device.ts';
import type { DeviceType } from './device.ts';

const DEVICE_BREAKPOINTS = {
    MOBILE_MAX: 768,
    DESKTOP_MIN: 1024,
};

type DeviceMediaQueries = Record<DeviceType, MediaQueryList>;

let mediaQueries: Nullable<DeviceMediaQueries> = null;

const ensureInitialized = (): DeviceMediaQueries => {
    if (mediaQueries === null) {
        throw new Error('deviceTypeService is not initialized.');
    }

    return mediaQueries;
};

const updateDeviceType = () => {
    const deviceTypeStore = useDeviceTypeStore();

    const mediaQueryEntries = Object.entries(ensureInitialized()) as [DeviceType, MediaQueryList][];

    for (const [type, mediaQuery] of mediaQueryEntries) {
        if (mediaQuery.matches) {
            deviceTypeStore.set(type);

            break;
        }
    }
};

const initMediaQueries = () => {
    mediaQueries = {
        [DEVICE_TYPES.MOBILE]: window.matchMedia(`(max-width: ${DEVICE_BREAKPOINTS.MOBILE_MAX}px)`),
        [DEVICE_TYPES.TABLET]: window.matchMedia(
            `(min-width: ${DEVICE_BREAKPOINTS.MOBILE_MAX + 1}px) and (max-width: ${DEVICE_BREAKPOINTS.DESKTOP_MIN - 1}px)`
        ),
        [DEVICE_TYPES.DESKTOP]: window.matchMedia(`(min-width: ${DEVICE_BREAKPOINTS.DESKTOP_MIN}px)`),
    };

    Object.values(mediaQueries).forEach((mediaQuery) => {
        mediaQuery.addEventListener('change', updateDeviceType);
    });
};

const init = () => {
    initMediaQueries();
    updateDeviceType();
};

export const deviceTypeService = {
    init,
};
