# feat(timeline): add `photos` array slot to `TimelinePhase`

## Summary

Extends `TimelinePhase` with a new public `photos?: Array<{ src: string; alt: string }>` field so a single timeline card can display more than one photo. The existing `photo` (singular) field is preserved for backward compatibility — no consumer changes required.

Also ships:

- Phase A theme utility docs, roadmap updates, and contributor guidelines (copilot-instructions)
- Git workflow rule (no direct pushes to `main`)
- `*.styles.ts` extraction pattern and enforcement checklist
- Storybook telemetry disabled for firewall-safe CI

---

## Why

The career timeline has moments where two photos belong to the same entry — for example, a front-view and a back-view photo taken at the same time, in the same room. The previous `photo` (singular) field had no way to express this. Consumers were forced to choose one photo or create a separate timeline entry just to show the second, which distorts the chronology.

---

## What changed

### `src/components/timeline-two-column/types.ts`

- Updated JSDoc on `photo` to clarify it is the single-photo variant and to point consumers toward `photos` when they have more than one.
- Added new `photos?: Array<{ src: string; alt: string }>` field with JSDoc.

### `src/components/timeline-two-column/phase-card.tsx`

Replaced the `phase.photo && <Box component="img" ... />` block with a unified render that handles both fields:

```tsx
{
  (phase.photos ?? (phase.photo ? [phase.photo] : null))?.map((p, i) => (
    <Box
      key={i}
      component="img"
      src={p.src}
      alt={p.alt}
      sx={{
        mt: i === 0 ? 2 : 1,
        // ... same sx as before
      }}
    />
  ));
}
```

**Precedence:** `photos` wins when both fields are present. `photo` is normalised to a single-element array so the render path is identical. The first photo gets `mt: 2` (space after description), subsequent photos get `mt: 1` (tighter gap within the photo strip).

### `.github/copilot-instructions.md`

Added the permanent git workflow rule:

> Never push directly to `main`. Every change goes through a branch and a pull request.

---

## Backward compatibility

- `photo` (singular) continues to work exactly as before — no consumer needs to change anything.
- `photos` is additive and optional.
- When neither field is present the render block produces `null` (same as before).

---

## Testing

`resolvePhotoSources` and `buildPhotoNodes` are exported from `phase-card.tsx` (same pattern as `derivePlatformEntry`/`buildPlatformStripItems`) so tests exercise the real production code path — not a mirror of the inline expression.

Regression tests in `phase-card.test.ts`:

- `photos` array produces one entry per photo (`resolvePhotoSources`)
- `photo` (singular) is normalised to a single-element array (`resolvePhotoSources`)
- `photos` takes precedence over `photo` when both are present (`resolvePhotoSources`)
- Neither field present → returns null (`resolvePhotoSources`)
- Render-level: `buildPhotoNodes` produces `<img>` elements with correct `src` and `alt`
- Render-level: photos absent when `expanded=false`; present when `expanded=true`

Styles extracted to `phase-card.styles.ts` (`photoImgSx` factory), tested in
`phase-card.styles.test.ts` with a minimal mock theme.

All checks pass:

```
✅ Prettier
✅ ESLint
✅ tsc --noEmit
✅ Vitest (395 tests)
✅ tsup build
✅ Storybook build
```

---

## Related

- Consumer usage: `alexrebula` career timeline key 0.6 (`~1994 First Internet Connection`) — two photos from the same session now both shown on the card.
- Branch: `feature/photos-array-slot`
