# GiselleMUIDemoTemplate — component plan

**Taxonomy group:** `Templates`
**Storybook title:** `'Templates/MUI Demo Template'`
**Source path:** `src/components/templates/mui-demo/`
**Phase:** Phase 3 (after Phase 2 sub-component elevation)
**Export:** main bundle (`src/index.ts`)

---

## Why this component exists

The alexrebula portfolio needs 30+ individual component showcase pages — one per
giselle-mui component. Each page shares the same three-column shell:

- left sidebar: primary component nav (all groups)
- centre: scrollable demo sections (variants, states, usage examples)
- right sidebar: section-anchor nav (scroll spy showing which section is active)

Without a template, this shell would be re-implemented in every showcase page. The
common alternative — a single God component that owns layout, scroll logic, hero
rendering, data props, and breadcrumbs all in one — creates an untestable monolith
that cannot be composed or extended without forking.

`GiselleMUIDemoTemplate` encodes the layout grid only. It accepts **slots**. It
knows nothing about content.

---

## What it is NOT

- Not a God component — it owns the grid only, not the data or scroll state
- Not aware of `allGiselleComponents` — nav data is passed in as a slot
- Not responsible for scroll-spy logic — scroll state lives in the calling View
- Not aware of breadcrumbs, route paths, or any specific component name

---

## Atomic role

| Level    | Component                 | Responsibility                                       |
| -------- | ------------------------- | ---------------------------------------------------- |
| Template | `GiselleMUIDemoTemplate`  | Three-column CSS grid, slot arrangement              |
| Organism | `GiselleDemoHero`         | Top hero banner + breadcrumbs                        |
| Organism | `GiselleDemoPrimaryNav`   | Left sidebar: renders allGiselleComponents groups    |
| Organism | `GiselleDemoSecondaryNav` | Right sidebar: section anchor list with active state |
| Organism | `GiselleDemoSection`      | Card with anchor ID, title, description, content     |
| Molecule | `GiselleNavGroup`         | One nav group heading + item list                    |
| Molecule | `GiselleNavItemLink`      | Single nav item (name, href, active state)           |

---

## Props API

```ts
// types.ts

export type GiselleMUIDemoTemplateProps = {
  /** Hero banner slot — render GiselleDemoHero here. */
  hero: ReactNode;
  /** Left sidebar slot — render GiselleDemoPrimaryNav here. */
  primaryNav: ReactNode;
  /**
   * Right sidebar slot — section anchor list.
   * Hidden below `xl` breakpoint. Omit for simple pages with no sections.
   */
  secondaryNav?: ReactNode;
  /** Main content area. Render GiselleDemoSection items here. */
  children: ReactNode;
  sx?: SxProps<Theme>;
};
```

---

## Layout scheme

```
┌─────────────────────────────────────────────────────────┐
│  GiselleDemoHero (hero slot — full width above grid)    │
├──────────────┬──────────────────────┬───────────────────┤
│ primaryNav   │ children             │ secondaryNav      │
│ (220px)      │ (fluid)              │ (220px)           │
│              │                      │ hidden below xl   │
│ shown md+    │                      │                   │
└──────────────┴──────────────────────┴───────────────────┘
```

CSS variables (defined on the template root):

```ts
'--nav-width': '220px'
'--layout-gutters': '16px'   // → 20px at md → 80px at xl
'--layout-gap': '24px'
'--section-gap': '24px'
```

Grid columns:

- `xs/sm`: single column (nav hidden, secondary nav hidden)
- `md`: `var(--nav-width) auto` (primary nav visible)
- `xl+`: `var(--nav-width) auto var(--nav-width)` (both navs visible)

---

## Organism specs

### `GiselleDemoHero`

```ts
type GiselleDemoHeroProps = {
  heading: string;
  links?: Array<{ name: string; href?: string }>; // breadcrumb links
  description?: string;
  additionalContent?: ReactNode;
  sx?: SxProps<Theme>;
};
```

- Renders a hero section with a blurred background gradient (using `theme.vars.palette.background.defaultChannel`)
- Breadcrumbs: `Home → Components → <heading>`
- Background: raw CSS `linear-gradient` using `theme.vars.palette` channel tokens — no third-party mixin

### `GiselleDemoPrimaryNav`

```ts
type GiselleDemoPrimaryNavProps = {
  navData: GiselleNavSection[]; // from nav-config.ts in alexrebula
  sx?: SxProps<Theme>;
};
```

- Renders groups from `navData` as `GiselleNavGroup` molecules
- Active state driven by `usePathname()` (Next.js) or `window.location.pathname`
- Sticky positioning: `position: sticky; top: 120px`
- Scrollable vertically if it overflows viewport

### `GiselleDemoSecondaryNav`

```ts
type GiselleDemoSecondaryNavProps = {
  sections: Array<{ id: string; name: string }>;
  activeIndex: number;
  onClickItem: (index: number) => void;
  sx?: SxProps<Theme>;
};
```

- Section anchor list — no routing, just smooth-scroll to section IDs
- `activeIndex` controlled externally (scroll-spy hook lives in the View, not here)
- Why: the scroll-spy hook uses `IntersectionObserver` which is client-only and
  specific to the page's DOM. The template and this organism stay server-renderable.

### `GiselleDemoSection`

```ts
type GiselleDemoSectionProps = {
  id: string; // DOM anchor ID (kebab-case of name)
  name: string; // card title
  description?: string; // card subtitle
  children: ReactNode; // demo content
  action?: ReactNode; // optional card header action
  sx?: SxProps<Theme>;
};
```

- Renders as a `Card` with `id={id}` for scroll-spy targeting
- Title links to `#id` (in-page anchor)
- `children` is the live component demo

---

## Calling pattern (in alexrebula View)

The View owns:

1. `sections` data (array of `{ id, name, description, component }`)
2. `activeIndex` state (from scroll-spy hook)
3. `scrollToSection` handler

The template and organisms are pure layout/display — no data wiring inside them.

```tsx
// GiselleAccordionView.tsx (alexrebula)
'use client';

import { useCallback } from 'react';
import {
  GiselleMUIDemoTemplate,
  GiselleDemoHero,
  GiselleDemoPrimaryNav,
  GiselleDemoSecondaryNav,
  GiselleDemoSection,
} from '@alexrebula/giselle-mui';
import { allGiselleComponents } from '../nav-config';
import { useGiselleDemoScroll } from '../hooks/use-giselle-demo-scroll';

const SECTIONS = [
  {
    id: 'basic',
    name: 'Basic',
    description: 'Default accordion behaviour',
    component: <AccordionBasic />,
  },
  { id: 'controlled', name: 'Controlled', component: <AccordionControlled /> },
];

export function GiselleAccordionView() {
  const { activeIndex, scrollToSection } = useGiselleDemoScroll(SECTIONS.length);

  return (
    <GiselleMUIDemoTemplate
      hero={
        <GiselleDemoHero
          heading="Accordion"
          links={[{ name: 'Components', href: '/little-branches/giselle/mui' }]}
        />
      }
      primaryNav={<GiselleDemoPrimaryNav navData={allGiselleComponents} />}
      secondaryNav={
        <GiselleDemoSecondaryNav
          sections={SECTIONS}
          activeIndex={activeIndex}
          onClickItem={scrollToSection}
        />
      }
    >
      {SECTIONS.map((section, i) => (
        <GiselleDemoSection
          key={section.id}
          id={section.id}
          name={section.name}
          description={section.description}
        >
          {section.component}
        </GiselleDemoSection>
      ))}
    </GiselleMUIDemoTemplate>
  );
}
```

---

## Scroll-spy hook (in alexrebula — not in giselle-mui)

The scroll-spy hook is app-specific and uses `IntersectionObserver`. It does NOT belong
in giselle-mui because it is tied to the specific DOM query class used by the showcase pages.

```ts
// src/sections/little-branches/giselle/mui/hooks/use-giselle-demo-scroll.ts
'use client';
export function useGiselleDemoScroll(sectionCount: number) {
  // IntersectionObserver watching .giselle-demo-section elements
  // Returns { activeIndex, scrollToSection }
}
```

---

## File structure

```
src/components/templates/mui-demo/
  mui-demo-template.tsx               — template shell (slots + CSS grid)
  types.ts                            — GiselleMUIDemoTemplateProps + all sub-component types
  mui-demo-template.styles.ts         — cssVars factory, layoutRootSx, layoutContainerSx
  mui-demo-template.styles.test.ts    — mock-theme assertions for sx factories
  mui-demo-template.stories.tsx       — 'Templates/MUI Demo Template'
  index.ts                            — barrel
  README.md                           — why it exists, slot contract
  giselle-demo-hero.tsx               — GiselleDemoHero organism
  giselle-demo-primary-nav.tsx        — GiselleDemoPrimaryNav organism
  giselle-demo-secondary-nav.tsx      — GiselleDemoSecondaryNav organism
  giselle-demo-section.tsx            — GiselleDemoSection organism
  giselle-nav-group.tsx               — GiselleNavGroup molecule (one group in primary nav)
  giselle-nav-item-link.tsx           — GiselleNavItemLink molecule (one nav item)
```

All exported from `index.ts`. All re-exported from `src/index.ts`.

---

## What is NOT in giselle-mui

| Belongs in alexrebula                                              | Reason                                                              |
| ------------------------------------------------------------------ | ------------------------------------------------------------------- |
| `allGiselleComponents` nav data                                    | Lists giselle-mui's own components — self-referential, app-specific |
| `useGiselleDemoScroll` hook                                        | `IntersectionObserver` + DOM query — client-only, page-specific     |
| Individual component showcase Views (`GiselleAccordionView`, etc.) | Route-specific; compose the template with real data                 |
| SVG thumbnails (`/assets/icons/giselle-mui/*.svg`)                 | Static portfolio assets                                             |

---

## Definition of done

- [ ] `GiselleMUIDemoTemplate` renders the three-column grid with correct breakpoints
- [ ] `GiselleDemoHero` renders hero banner with breadcrumbs, zero third-party theme imports
- [ ] `GiselleDemoPrimaryNav` renders all nav groups; active item highlighted
- [ ] `GiselleDemoSecondaryNav` renders section anchors; active item highlighted
- [ ] `GiselleDemoSection` renders Card with anchor ID + title + children
- [ ] All types in `types.ts`, all sx in `*.styles.ts`, all constants in `*.const.ts`
- [ ] `*.styles.test.ts` covers every sx factory
- [ ] Storybook story: `'Templates/MUI Demo Template'` with realistic demo content
- [ ] `npm run check:verify` exits 0
- [ ] `npm run build` exits 0
- [ ] `yalc push` + alexrebula validated (one showcase page working end-to-end)
