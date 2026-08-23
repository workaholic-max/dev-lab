# SCSS token barrel + module aliasing

A way to reach a project's own SCSS design tokens — colors, spacing, breakpoints, radius, and the rest — the same way from any file at any nesting depth: one build-tool alias resolved straight to the tokens' own module path, with the tokens themselves split one partial per category and forwarded through a single barrel under an explicit prefix, instead of a single flat `_variables.scss` file everything gets crammed into, a relative import that breaks the moment a file moves, or Tailwind's generated utility classes. It's for the kind of project that writes its own SCSS rather than composing Tailwind's utility strings in markup — where a design token is a named Sass variable used inside a real stylesheet (`vars.$space-sm`), not a class Tailwind's build step already turned that same value into (`p-2`). Tailwind gets its "pull a fixed set of values from one place" discipline from a config file that generates classes; this gets the same discipline a different way — real Sass variables, organized so reaching them doesn't get worse as the component tree grows.

## When this earns its keep

A feature folder nested four or five levels deep — a view sitting under something like `<feature>/views/create/SomethingView.vue` — is exactly where a flat token file or a relative import starts to hurt. A single `_variables.scss` holding every color, spacing value, and breakpoint an app uses works fine until it holds a few dozen of them, at which point `$sm` and `$card` sit next to `$gray-500` and `$transition-duration` with nothing but a comment, if that, separating what's spacing from what's color. Reaching those tokens with a relative path instead — `@use '../../../../assets/styles/abstracts/variables' as vars;` — breaks the moment the file it's written in moves, and gives no signal at a glance of what it's even pointing at. Below that size, or with a token list that stays short, a flat file is simpler and this is just ceremony; it only pays for itself once the category list and the folder depth both get real. And it's a convention for a project that's already committed to hand-written SCSS, not a case for introducing SCSS into one that's already happy with Tailwind.

## How it works

Each token category lives in its own partial, and a single `_index.scss` forwards every one of them under an explicit prefix:

```scss
// abstracts/variables/_index.scss
@forward './colors' as color-*;
@forward './spacing' as space-*;
@forward './breakpoints' as breakpoint-*;
```

The category partial itself stays unprefixed — `_colors.scss` defines `$white` and `$gray-500`, not `$color-white` — the prefix is applied once, at the forward, rather than hand-typed into every variable name in every partial. That gets the same flat, single-import ergonomics as one giant file (`vars.$color-gray-500`, `vars.$space-sm`) while keeping each source file small and organized by what it actually holds. It isn't free: adding a new category costs two edits instead of one — a new partial, plus one `@forward` line — against a flat file's one, which is the real, ongoing tax behind the "when this earns its keep" call above.

The second half is a build-tool alias pointed directly at the SCSS module path, not just the equivalent JS one:

```js
// vite.config — resolve.alias entries apply to Sass module resolution too
resolve: {
  alias: {
    '@style-vars': path.resolve(__dirname, 'src/assets/styles/abstracts/variables'),
    '@style-mixins': path.resolve(__dirname, 'src/assets/styles/abstracts/mixins'),
  },
},
```

which makes the import identical at any call site, regardless of nesting:

```scss
// any component, at any depth
@use '@style-vars' as vars;
@use '@style-mixins' as mixins;

.button {
  padding: vars.$space-sm;
  @include mixins.transition(background-color);
}
```

A component three folders deep and one at the top level write that exact same line, and moving either one doesn't change it — the alternative, a relative `@use '../../../abstracts/variables' as vars;`, breaks the moment the file it's written in moves.

## Why the alias points at a Sass module path, not just a JS one

`@style-mixins` above resolves to `abstracts/mixins` — a path that isn't actually a directory; the real file is a single partial, `abstracts/_mixins.scss`, sitting directly under `abstracts/` rather than inside a folder of its own. It still resolves, because Sass doesn't require the last segment of a `@use` path to literally be a directory: it resolves that segment against a same-named partial file (`_name.scss`) in the parent directory when no such directory exists, or against that directory's own `_index.scss` when one does. `@style-vars` (a real directory with its own `_index.scss`) and `@style-mixins` (a partial living directly in `abstracts/`) both resolve under that same rule — which is what lets one aliasing convention serve both shapes without whoever adds a new alias needing to know or care which one they're pointing at. Vite passes its `resolve.alias` entries through to Sass's own module resolution for `.scss` files the same way it does for JS imports, which is what makes an alias defined once in `vite.config` usable from `@use` at all — without that, this would need its own Sass-specific alias configuration instead of reusing the one the project already has.
