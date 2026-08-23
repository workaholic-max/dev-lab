# Click-outside directive

A custom Vue directive that calls a callback when a click lands anywhere outside the element it's bound to.

## Use cases

**A dropdown or popover menu** — without this, a click anywhere else on the page leaves it open. Wiring `v-click-outside="close"` onto the menu's root element is enough to close it, without the component tracking its own document-level listener.

## How it works

On `beforeMount`, it attaches a `click` listener to `document` — not to the bound element — that checks whether the click's target is inside the element (`el.contains(event.target)`). If it isn't, the bound callback fires. `unmounted` removes the same listener, keyed off a reference stashed directly on the element (`el.clickOutsideEvent`) so the exact same function instance can be passed to both `addEventListener` and `removeEventListener`.

The listener is registered with `{ capture: true }` — the capture phase, not the default bubble phase. That matters for elements that might get removed from the DOM by another handler during the same click's dispatch (for example, a menu item's own click handler closing and unmounting the menu before the event finishes bubbling). Running in the capture phase means this handler runs early, before anything else that click triggers has a chance to mutate the DOM out from under it.

## Why a plain import instead of global registration

This directive is exported as `vClickOutside` and imported into the specific components that need it — never registered globally on the Vue app instance. The naming is what makes a plain import enough on its own: Vue's `<script setup>` auto-recognizes any imported camelCase binding starting with `v` as a directive, so importing `vClickOutside` is all it takes to use `v-click-outside="handler"` in that component's template — no `app.directive()` call, no local `directives: {}` option, no second registration step anywhere.
