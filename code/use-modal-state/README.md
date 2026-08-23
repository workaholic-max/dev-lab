# Modal state composable

A composable that gives the component owning a modal its own `{ context, isOpened }` state and `open`/`close` actions, instead of that same small pile of state getting hand-rolled slightly differently inside every component that owns one.

## The problem

Every component that owns a modal needs the same small pile of state — is it open right now, what data does it need to render this particular time — plus a way for something outside it to trigger that open without also handing over the ability to close it or read its internals. Hand-rolled per component, that shape is easy to get subtly wrong: exposing an `isOpened` ref directly lets an unrelated trigger flip it closed from outside, or read `context` after the modal has already reset it on close. `useModalState` is the one place this shape gets defined correctly, so every modal built on it starts from the same narrow contract instead of each one re-deriving its own version of it.

## How it works

```ts
const { modalState, modalActions, modalExpose } = useModalState<SomeContext>();
```

`modalState.context` holds whatever data the modal needs for this particular open — which entity is being edited, which item was clicked — typed via the generic (`useModalState<Employee>()`) so a consumer isn't stuck with `unknown` on the way out. It's written once, by `open(context)`, and cleared back to `null` by `close()`; nothing in between ever updates it, which is why call sites read `modalState.context.someField` freely in computed properties and template bindings without worrying about it changing mid-render. `open()` also works with no argument — `context` just stays `null` — for a modal whose content doesn't depend on anything beyond `isOpened`, e.g. a fixed-title confirmation dialog.

`modalActions.open(context)`/`close()` are what the modal's own component calls on itself. `modalExpose` is a separate, narrower object containing only `open`, meant to be passed straight to `defineExpose(modalExpose)` — an outside trigger holding a template ref to this component gets `.open(context)` and nothing else; it can't call `.close()` or read `isOpened` off the ref, so closing stays entirely the modal's own decision, driven by its own `@close` handler back to `modalActions.close()`. That `defineExpose(modalExpose)` line still has to be written by hand in every component that uses this composable — the composable can narrow *what* gets exposed, but it can't make the exposing itself automatic.

`modalState.context` is typed as `TContext | null` rather than as a discriminated union keyed off `isOpened` — every read of it after `isOpened` becomes true still has to deal with the `null` case at the type level, even though in practice `context` is only ever `null` while the modal is closed. The more precise version would tie `context`'s nullability to `isOpened` directly, which is more type-safe but also more ceremony for what's meant to stay a small, low-friction composable — left as the simpler, slightly-less-precise version on purpose.

The modal's own component owns the state and gates its own close — here against its own in-flight `isSaving`, unrelated to anything `useModalState` itself tracks:

```vue
<script setup lang="ts">
const { modalState, modalActions, modalExpose } = useModalState<{ employeeId: string }>();

defineExpose(modalExpose);

const isSaving = ref(false);

const save = async () => {
    isSaving.value = true;
    await apiClient.request({ method: 'post', url: `/employees/${modalState.context!.employeeId}` });
    isSaving.value = false;
    modalActions.close();
};
</script>

<template>
    <Modal.Overlay
        :is-opened="modalState.isOpened"
        :is-close-disabled="isSaving"
        @close="modalActions.close"
    >
        <Modal.Dialog title="Edit employee">
            <template #content>Employee id: {{ modalState.context?.employeeId }}</template>

            <template #actions>
                <button @click="modalActions.close">Cancel</button>
                <button :disabled="isSaving" @click="save">Save</button>
            </template>
        </Modal.Dialog>
    </Modal.Overlay>
</template>
```

Something else entirely — a row in a table, a menu item — triggers it through a template ref, never touching `modalState` or `modalActions` directly, only what `modalExpose` handed it:

```vue
<script setup lang="ts">
import { useTemplateRef } from 'vue';

import EditEmployeeModal from './EditEmployeeModal.vue';

const editEmployeeModalRef = useTemplateRef<InstanceType<typeof EditEmployeeModal>>('editEmployeeModalRef');

const openEdit = (employee: Employee) => editEmployeeModalRef.value?.open({ employeeId: employee.id });
</script>

<template>
    <EditEmployeeModal ref="editEmployeeModalRef" />
</template>
```

## Pairs with

[`modal-system`](../modal-system) — its `Overlay`/`Dialog` are the actual rendered modal; this composable is the state that decides what they render and when, colocated with the component whose logic that state depends on.
