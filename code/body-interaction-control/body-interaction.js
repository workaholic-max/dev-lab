const BODY_INTERACTION_LOCK_CLASS = 'ml-body--interaction-locked';

let lockCount = 0;

const lock = () => {
    if (lockCount === 0) {
        document.body.classList.add(BODY_INTERACTION_LOCK_CLASS);
        document.body.setAttribute('inert', '');
    }

    lockCount += 1;
};

const unlock = () => {
    lockCount = Math.max(lockCount - 1, 0);

    if (lockCount === 0) {
        document.body.classList.remove(BODY_INTERACTION_LOCK_CLASS);
        document.body.removeAttribute('inert');
    }
};

export const bodyInteractionControl = {
    lock,
    unlock,
};
