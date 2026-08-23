# Documentation

How to write the description document for a self-contained entry — what it is, why it exists, how it works — clearly and honestly, regardless of what the entry contains or what language it's written in.

**The writing is not a claim about how the entry was produced.** This file governs how something gets described, not how it was built. Don't say or imply anything about tooling or process used to create the entry itself. Never add a provenance section or describe the private project, source file, retyping, restyling, or other production history behind the published entry.

## 1. What it has to answer

A reader should be able to tell, in the first few sentences, what the entry is and why it exists rather than some other way of solving the same problem. A reader who wants to know when they'd actually reach for it should find that answer within the next few sentences too, not buried inside the mechanism section. Everything after that fills in how it actually works and anything else worth knowing before relying on it.

## 2. Structure

**Required, in this order:**

1. **Title.**
2. **Description** — one short passage: what the entry is, stated generically, plus the alternative it replaces. Not how one particular situation happens to use it — see §3.
3. **How it works** — the entry's actual mechanism: what it fundamentally *is*. A useful test: if every optional capability described below were stripped away, what would still be left as "the thing this is"? That's what belongs here — not whichever capability happens to be the most complex to implement.

**Optional, used only when they genuinely earn their place, and only in this relative order when they appear:**

- **A short bulleted capability list** — directly after the description, before anything else, including use cases. Only when there are two or more genuinely distinct things worth letting a reader scan before committing to the fuller explanation below. Each item pairs a short, bolded, concrete name with one tight sentence of real payoff, grounded in something the entry actually does. A bullet that could be pasted unchanged onto a completely unrelated entry isn't concrete enough — it's standing in an adjective for a reason. Every item has to be true today; this is not the place to describe what could be added later. Not showing a worked example doesn't excuse skipping the reasoning — say why something is worth having even without a code sample; just never describe behavior that doesn't exist yet. This list reads as a scannable continuation of the description, not as its own separate argument — which is also why it sits immediately against the description, with nothing between them.
- **Use cases** — after the capability list if one is present, otherwise directly after the description; always before "how it works." One or a few concrete, real situations where this is what you'd reach for, and what goes wrong without it — the concreteness that §3 disqualifies from the description lives here instead, see §4. Skip this section outright when the entry is small and self-evident enough that any scenario would just restate the description with a label glued on — a type alias, a one-line formatter. One or two real, well-chosen situations do more than several thin ones; this isn't a place to enumerate every current caller. This section keeps this same position even when it's named for what it actually is instead of literally "Use cases" — `The problem`, `Why bother`, `When this earns its keep` are this same section under a more specific name, not a different, later one (see §4).
- **One deep-dive section per capability that needs more than its one-line summary** — named `About: <capability>` (`About: request cancellation`, not `Feature: request cancellation` or a bare `Request cancellation`) — mechanism, reasoning, and any real caveat specific to that one thing, in the order the summary list introduced them. Most won't need one. Don't split a single capability's explanation across more than one of these.
- **Whatever else the entry genuinely needs to say** — one specific design decision worth defending on its own, a trade-off against a genuinely different concrete alternative (not a restatement of the capability list in "compared to not using this at all" framing), something deliberately left out and why. This is not where "the problem that motivated it" belongs if that's really the use-cases reasoning under a different name — that lives in the Use cases slot above, per §4, however it's named. It belongs here only for background a reader needs that isn't itself an answer to "when would I reach for this." Name each of these for the specific thing it explains rather than forcing a generic label where a more accurate one says more.
- **Files** — when an entry has more than one obvious source file (a separate `types.ts`, `utils.ts`, an `Example.*`), say what's in each and *why* it's split that way, not just that each file exists — `http-error-catchers` already does this well: "`types.ts` defines the supported status codes and backend error contract. `utils.ts` owns the runtime narrowing from `unknown` to that contract...". Skip it outright for a single-file entry; a file list with one entry in it isn't earning its place.
- **A recommendation for where this should eventually live** — a personal, forward-looking note that this entry belongs alongside another one, in a grouping or folder that doesn't exist yet, when the reason is repo organization rather than a real technical relationship between the two (contrast with "How this relates to other entries," immediately below, which is for a relationship that already exists today). Concrete only: name the sibling and the destination — "by convention, this belongs alongside X under a shared Y/ folder eventually" — not a running wishlist of restructuring ideas. Drop it the moment it's acted on; once the move happens, the folder itself is the record, not a sentence describing an intention to make one.
- **How this relates to other entries** — only if a genuine relationship exists, and always the very last thing in the document. One line per relationship: what it is, and why it's related. `Pairs with` is this repo's established name for this section when the relationship is "these two are normally used together" — reuse it rather than inventing a synonym per entry (see §9). Not a restatement of a relationship a paragraph above has already explained in depth — a short recap for someone skimming straight to the end.

Nothing sits between the description, the capability list (if present), or the use cases (if present) and the first real section header as its own free-floating paragraph. If a relationship, recommendation, or aside doesn't need a whole section, it belongs as a compact line in the closing "relates to" list or the "where this should live" recommendation, or folded as a clause into whichever section already covers it.

## 3. Describe the thing itself, not one way it's used

An opening that's only true because of how one particular caller happens to use the entry is too narrow — it describes a relationship, not the entry. Test it: would this description still be accurate if every current user of it disappeared tomorrow? If not, state it one level more generally, and move the specific relationship down into the use cases section instead.

Default shape: what it is, stated generically, plus the honest alternative it replaces. Naming the alternative is what tells a reader why this exists before any implementation detail does. A description that leans on "for example, when..." to make itself land is a description that's actually reaching for a use case — move it down rather than loosening the description to fit it.

## 4. Use cases vs. description

A description answers "what is this, in general." A use case answers "when would I actually reach for this, and what goes wrong if I don't." The description has to still be true if every current caller vanished tomorrow (§3's test); a use case is explicitly allowed to name a real trigger and a real consequence, because naming them concretely is the entire point of the section.

A good use case names the situation and the failure it prevents in one breath — "an overlay spinner covering only part of the screen, so the controls outside it stay clickable while the action behind it is still in flight" reads differently, and says more, than "useful for loading states." The second sentence could sit under almost any entry in this repo; the first couldn't sit under any other.

Write it as "when X happens" rather than "in `ThisComponent`, we..." so it still reads correctly if a second caller shows up later — but if the only honest use case really is one specific component, today, say that plainly rather than dressing a one-off up as a general pattern it isn't yet. This section is not the place to list every current caller; naming one or two real situations does more than an exhaustive inventory, and an inventory belongs in "how this relates to other entries" if it's worth recording at all.

Some entries already carry this reasoning under a differently-named section — a "problem this solves," a "why bother," a "when this earns its keep." When that's true, a separate use cases section would just repeat it under a second heading; keep the existing section and skip this one rather than duplicating it. That section still occupies the use-cases slot in §2's structure — directly after the description (and after the capability list, if one exists), before "how it works" — regardless of what it's named; giving it a more specific name is a renaming, not a relocation down into the "whatever else" bucket further down in §2.

## 5. Code is shown sparingly

Default to prose. Show an actual snippet only when:

- a type, signature, or contract genuinely *is* the interesting part and says it more precisely than a paragraph would,
- real usage clarifies the shape faster than describing it would, or
- a specific, real gotcha is worth quoting close to verbatim.

Never use a snippet to narrate an implementation piece-by-piece, restating in prose next to it what the code already shows — that reads as an annotated walkthrough, not something skimmable in under a minute. State what something is and why it's built that way; let the actual code carry the mechanical detail.

## 6. Honesty lives inside the explanation, not in its own section

A caveat, an edge case, a real cost — these belong in the same passage that already explains the mechanism they apply to, not in a separately labeled section calling them out. If an entry reads as only upside, that's usually a sign the mechanism wasn't fully explained, not a missing section — the fix is explaining it completely, including what it doesn't handle, as part of the same explanation, not appending a confession afterward.

## 7. Relate entries to each other honestly

Where a genuine relationship exists between one entry and another — shares a mechanism, one produces what the other consumes, is a deliberate alternative to another approach documented elsewhere — say so, in both directions. Check whether the other side of the relationship should mention it back; a real relationship missing from one side is a real gap, not a nice-to-have.

## 8. Length matches what's actually there

A small, focused thing: a short passage. Something with several real decisions behind it: more, in proportion to those decisions. Something genuinely complex, compared honestly against real alternatives: long, and that's correct.

Short is only a problem if reasoning got left out. Long is only a problem if it's restating what the code already shows instead of explaining a decision the code alone doesn't convey.

## 9. Voice

- Third person about the thing itself, not first person about whoever made it.
- Introduce something by naming the alternative it replaces, by default.
- A specific section name beats a generic one whenever the generic one would undersell what's actually there — this applies to deep-dive headings too: `About: <capability>`, not `Feature:`/`Capability:` or a bare capability name with no prefix at all. `About:` is the one generic element allowed to repeat verbatim across every deep dive in every entry — it's a structural marker, not a description, so it doesn't compete with the specific-over-generic rule the way an adjective-standing-in-for-a-reason would.
- Once a term is established for a recurring kind of section, reuse it verbatim rather than swapping in synonyms for variety — consistent naming across entries is what makes many separately-written entries read as one voice.
- No adjectives standing in for reasons. If something is genuinely good, the reasoning shows it without a label.
- Precise, specific identifiers over paraphrased description.
- Long, reasoning-carrying sentences over choppy bullet fragments — bullets are for genuinely parallel, discrete items, not a default formatting choice.
- A short aside that carries real reasoning is fine inline; don't manufacture one for decoration.

## 10. Entries with no separate source

Some entries document a practice or a convention rather than something with its own importable source — a rule worth following, not something to reuse directly. Same rules apply. Any illustrative snippet sits near the top, close to the definition, since there's no separate file to point a reader to instead. These lean more on *why the practice earns its cost* than on *how a mechanism works* — name the real cost, and the point past which it stops being worth paying. Most of these already state that cost/benefit under their own heading rather than a generic "use cases" label (`stateful-composables`'s "Honest trade-off," `fragments-convention`'s "When this earns its keep over one growing function") — per §4, that's the use case doing its job under a more specific name, not a section to duplicate.

## 11. Naming doesn't need to be settled immediately

If a name ends up reading awkwardly once it's actually written down — a concept repeated between a container and the thing inside it, for instance — that's fine to leave for now rather than block on getting it perfect up front. Don't treat an existing name as a pattern to imitate elsewhere just because it's already there. Prefer choices that are easy to rename out of later over defending an early guess.

## 12. Adding something new — before finishing

- Confirm every relationship mentioned actually resolves to something real.
- Re-check the description against §3, and "how it works" against the root-vs-capability distinction in §2.
- Check the use cases section, if present, against §4 — concrete and plural-in-spirit, not a restatement of the description above it, not an inventory of every current caller.
- Record the new entry wherever this repo keeps its index of entries, in that index's existing voice.

## 13. Reviewing or rewriting something that already exists

Same standard, run in the other direction, one entry at a time:

1. Read the existing description and its actual source together — stay accurate to what it really does; don't invent a caveat, trade-off, or use case just to fill a section.
2. Check the opening against §3 first — the most likely place for drift.
3. Walk §2's structure — anything present that isn't earning its place, anything missing that should be. Check specifically whether a use case is missing, or whether one already exists under a different heading (§4, §10) and shouldn't be duplicated.
4. Check any code shown against §5 — collapse anything that narrates an implementation piece-by-piece.
5. Check §6–§8 — honesty folded into the explanation rather than sectioned off, relationships current, length matching what's actually there.
6. Check the voice (§9) against the current text.
7. Update this repo's index of entries if the summary there no longer matches.

Edit in place — don't keep a separate copy of the previous version alongside the new one. Whatever this repo already uses for history covers "what did this used to say."

Report per entry in one or two lines: what changed and why. If nothing needed to change, say so plainly rather than making a cosmetic edit just to show it was reviewed.
