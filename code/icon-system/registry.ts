import type { ValueOf } from '../shared-types/types.ts';

// ───────────────────────────────────────────────────────
// Icon names
// ───────────────────────────────────────────────────────

export const ICON_NAMES = {
    ARROW: 'arrow',
    CHECKLIST: 'checklist',
    EDIT: 'edit',
    USER: 'user',
    // ...remaining icons, kept alphabetically ordered on purpose:
    // readability, discoverability, and merge-conflict friendliness.
} as const;

export type IconName = ValueOf<typeof ICON_NAMES>;

// ───────────────────────────────────────────────────────
// Icon modes
// ───────────────────────────────────────────────────────

// Icons listed here render via background-image (multicolor, fixed colors).
// Everything else renders via mask-image (single-color, runtime-recolorable).
export const BACKGROUND_IMAGE_ICONS: IconName[] = [ICON_NAMES.CHECKLIST];

// ───────────────────────────────────────────────────────
// Icon directions
// ───────────────────────────────────────────────────────

export const ICON_DIRECTIONS = {
    UP: 'up',
    RIGHT: 'right',
    DOWN: 'down',
    LEFT: 'left',
} as const;

export type IconDirection = ValueOf<typeof ICON_DIRECTIONS>;
