# Group filter

A search box plus a horizontally-scrollable row of group chips, sitting above whatever content is being filtered — options outside the current result set stay visible but disabled, rather than disappearing, so the full set of groups stays visually stable as a search narrows things down.

## How it works

`GroupFilter` takes two props — `groupOptions: GroupOption[]` and `activeGroupValues: Set<string>` — plus two `v-model`s it owns internally, `searchQuery` and `activeGroup`. Each `GroupOption` is a plain `{ value, label }` pair — `label` renders on the chip, `value` is what the parent and the component key everything else off of. The chip row renders one button per `groupOptions` entry; clicking a chip sets `activeGroup` to that option's `value`. The default slot only mounts once `isActiveGroupContentReady` is true — either `activeGroup` has actually been set, or `activeGroupValues` is empty outright — so a parent's content never renders against a still-`null` selection while there are real groups to choose from.

`activeGroupValues` is the set of group values that currently have at least one match, computed by the parent from whatever's being filtered. A group option not in that set renders `disabled` rather than being removed — hiding groups as a search narrows results would make the whole chip row jump around and reflow on every keystroke. Once there's at least one active group value, `sortedGroupOptions` also moves every disabled option behind the enabled ones, so the groups still worth clicking stay clustered at the front instead of interleaved with ones the current search has ruled out.

```ts
watch(
    () => activeGroupValues,
    (activeValues) => {
        if (activeGroup.value !== null && activeValues.has(activeGroup.value)) return;

        activeGroup.value = activeValues.values().next().value ?? null;
    },
    { immediate: true }
);
```

If a search narrows the result set enough that the currently-selected group no longer has any matches, this falls back to the first group that still does, rather than leaving the UI pointed at a selected-but-empty group. `{ immediate: true }` also handles initial mount, before anything's been explicitly selected. Nothing scrolls the newly-selected chip into view when this fallback fires — worth adding via `scrollIntoView({ inline: 'nearest' })` on the active chip if that becomes a real point of confusion in practice.

## Files

`types.ts` defines `GroupOption` on its own so `Example.vue`'s demo data is checked against the exact same `{ value, label }` contract `GroupFilter.vue` declares, not a shape that just happens to match it today. `Example.vue` is a working demo, not something the component itself imports — it owns everything a real parent has to: turning a raw item list into `groupOptions`, deriving `activeGroupValues` from whichever items the current search query matches, and rendering the filtered result through the default slot — so `GroupFilter.vue` stays agnostic about what's actually being filtered.
