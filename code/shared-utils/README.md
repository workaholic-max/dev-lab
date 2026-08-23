# Shared utils

A small, deliberately minimal set of standalone helpers.

## About: file.ts

```ts
export const downloadFile = (data: BlobPart, fullName: string) => ...
```

- Triggers a browser download from in-memory data (a CSV export, a generated PDF) without navigating away from the page.
- Wraps the data in a `Blob`, gets an object URL, clicks a detached anchor pointed at it, then cleans up — both the anchor and, importantly, `URL.revokeObjectURL(url)`.
- Skipping the revoke step is the easy mistake: the object URL keeps its underlying data alive in memory until revoked or the page unloads, so a page that triggers many downloads without revoking leaks memory a little at a time.

## About: object.ts

```ts
export const isObject = (value: unknown): value is Record<string, unknown> => ...
export const getNestedObjectValue = <T>(source, path: string[]): Nullable<T> => ...
export const setNestedObjectValue = <T>(source, path: string[], value: T) => ...
export const extractFields = <T, K>(obj, keys: K[]): Pick<T, K> | null => ...
```

**`isObject`**

- A type guard for "plain object" — used internally by the two path helpers below to decide whether it's still safe to keep walking into a value.

**`getNestedObjectValue` / `setNestedObjectValue`**

- A minimal hand-rolled `get`/`set` for nested object paths. `path` is a plain array of string keys, walked one level at a time — `['data', 'user', 'info', 'name']` reads the same as `obj.data.user.info.name`.
- `path` is just `string[]`, not checked against `T`'s real shape at compile time — nothing stops a path that doesn't actually exist on the object passed in; on read, a wrong key resolves to `undefined` if it's the last segment of the path, or `null` if the path keeps going past it — either way nothing fails loudly, but the two outcomes aren't the same value, despite the return type claiming `Nullable<T>` either time. On write, a missing key just gets created fresh instead.
- `setNestedObjectValue` is auto-vivifying: any missing intermediate object along `path` gets created as `{}`. If an intermediate segment already holds a non-object value (a string, a number), that value is silently overwritten rather than throwing — know this before pointing it at a path that might already hold real data.
- Most often used for mapping API validation errors (`{ field: { nested: 'message' } }`-shaped payloads) onto form state without a chain of manual `?.` checks.
- Only accepts a plain array of string keys as the path — no `'a[0].b'` bracket-notation string parsing, and no support for indexing into an array by position. That's a real functional gap, not a style choice: a path that needs to reach into an array element isn't supported here.

**`extractFields`**

- Picks a fixed set of keys off an object into a new object, leaving everything else out.
- Returns `Pick<T, K>`, so the result carries the narrower type straight through — no cast needed at the call site.
- Only works one level deep, on a single object: no nested key paths, and no picking from a list of objects at once.

## About: string.ts

```ts
export const normalizeStr = (str: unknown) => String(str).trim().toLowerCase();
export const capitalizeFirstLetter = (word: string) => ...
```

- `normalizeStr` exists specifically to avoid case/whitespace mismatches in search and comparison code — trimming and lowercasing both the query and the searched fields so `" Smith"` matches `"smith"`.
- `capitalizeFirstLetter` is purely a display-formatting helper — upper-cases the first character, leaves the rest of the word untouched.
