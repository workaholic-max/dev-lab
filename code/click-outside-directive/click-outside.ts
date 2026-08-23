import type { DirectiveBinding } from 'vue';

// ───────────────────────────────────────────────────────
// Types
// ───────────────────────────────────────────────────────

interface ClickOutsideElement extends HTMLElement {
    clickOutsideEvent: (event: MouseEvent) => void;
}

// ───────────────────────────────────────────────────────
// Implementation
// ───────────────────────────────────────────────────────

export const vClickOutside = {
    beforeMount: (el: ClickOutsideElement, binding: DirectiveBinding<() => void>) => {
        el.clickOutsideEvent = (event) => {
            if (event.target instanceof Node && !el.contains(event.target)) {
                binding.value();
            }
        };

        document.addEventListener('click', el.clickOutsideEvent, { capture: true });
    },

    unmounted: (el: ClickOutsideElement) => {
        document.removeEventListener('click', el.clickOutsideEvent, { capture: true });
    },
};
