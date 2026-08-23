import { bodyScrollControl } from '../body-scroll-control/body-scroll.js';

type StandaloneNavigator = Navigator & {
    standalone?: boolean;
};

const REFRESH_THRESHOLD = 200; // px

let isEnabled = false;
let startY = 0;
let hasStartedAtTop = false;

const reset = () => {
    startY = 0;
    hasStartedAtTop = false;
};

const handleTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0];

    if (!touch) return;

    if (window.pageYOffset > 0 || bodyScrollControl.isLocked()) {
        return reset();
    }

    startY = touch.clientY;
    hasStartedAtTop = true;
};

const handleTouchEnd = (event: TouchEvent) => {
    if (!hasStartedAtTop) return;

    const touch = event.changedTouches[0];

    if (!touch) {
        return reset();
    }

    const deltaY = touch.clientY - startY;

    reset();

    if (window.pageYOffset <= 0 && deltaY >= REFRESH_THRESHOLD) {
        window.location.reload();
    }
};

const enable = () => {
    if (isEnabled) return;

    isEnabled = true;

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', reset, { passive: true });
};

const init = () => {
    const { standalone } = navigator as StandaloneNavigator;

    const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent);

    if (isIOS && standalone) {
        enable();
    }
};

export const pullToRefreshService = {
    init,
};
