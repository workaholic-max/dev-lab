# Shared types

A handful of small, reusable TypeScript types.

## About: type Nullable

```ts
export type Nullable<T> = T | null;
```

- `T | null`, named so every intentionally-nullable value is greppable (`Nullable<` vs. noisy `| null` searches).
- One place to change the nullability strategy project-wide later, if that's ever needed.

## About: type ValueOf

```ts
export type ValueOf<T> = T[keyof T];
```

- Turns an `as const` object into its value union — e.g. [`device-type-detection`](../device-type-detection)'s `ValueOf<typeof DEVICE_TYPES>` — instead of writing `(typeof X)[keyof typeof X]` by hand.
- Only reach for the `as const` object (and this) when something genuinely reads it at runtime; a plain string union is enough otherwise.

## About: type Optional

```ts
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
```

- Makes specific keys of `T` optional while the rest stay required.
- Common case: a "create" payload where an `id` doesn't exist yet.

## About: type ClassName

```ts
export type ClassName = string | Record<string, boolean> | ClassName[];
```

- Anything Vue's own `class` binding accepts: a single class string, an array of classes, or a class -> boolean map.
- Used by any component prop that lets a caller pass extra classes in — e.g. [`incremental-item-display`](../incremental-item-display)'s `maxHeightClassName`/`listClassName`.
