import { bodyScrollControl } from '../body-scroll-control/body-scroll.js';

const REFRESH_THRESHOLD = 200; // px

export const enableCustomPullToRefreshEvent = (): void => {
    let startY = 0;
    let hasStartedAtTop = false;

    const reset = () => {
        startY = 0;
        hasStartedAtTop = false;
    };

    window.addEventListener(
        'touchstart',
        (event: TouchEvent) => {
            const touch = event.touches[0];

            if (!touch) return;

            if (window.pageYOffset > 0 || bodyScrollControl.isLocked()) {
                return reset();
            }

            startY = touch.clientY;
            hasStartedAtTop = true;
        },
        { passive: true }
    );

    window.addEventListener(
        'touchend',
        (event: TouchEvent) => {
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
        },
        { passive: true }
    );

    window.addEventListener('touchcancel', reset, { passive: true });
};
