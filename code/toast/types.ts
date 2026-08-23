import type { ValueOf } from '../shared-types/types.ts';

export const TOAST_TYPES = {
    INFO: 'info',
    SUCCESS: 'success',
    FAIL: 'fail',
} as const;

export type ToastType = ValueOf<typeof TOAST_TYPES>;

export interface Toast {
    id: number;
    type: ToastType;
    message: string;
}
