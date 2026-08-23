import type { ValueOf } from '../shared-types/types.ts';

export const DEVICE_TYPES = {
    MOBILE: 'mobile',
    TABLET: 'tablet',
    DESKTOP: 'desktop',
} as const;

export type DeviceType = ValueOf<typeof DEVICE_TYPES>;
