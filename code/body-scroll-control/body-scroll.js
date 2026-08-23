const BODY_SCROLL_LOCK_CLASS = 'ml-body--scroll-locked';

let lockCount = 0;

const lock = () => {
    if (lockCount === 0) {
        document.body.classList.add(BODY_SCROLL_LOCK_CLASS);
    }

    lockCount += 1;
};

const unlock = () => {
    lockCount = Math.max(lockCount - 1, 0);

    if (lockCount === 0) {
        document.body.classList.remove(BODY_SCROLL_LOCK_CLASS);
    }
};

const isLocked = () => document.body.classList.contains(BODY_SCROLL_LOCK_CLASS);

export const bodyScrollControl = {
    lock,
    unlock,
    isLocked,
};
