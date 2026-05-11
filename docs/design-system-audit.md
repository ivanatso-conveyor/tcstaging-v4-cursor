# Design system audit

Single source of truth for colors: **`trust-center/src/index.css`** inside the `@theme` block. Customer header and accent defaults also live in **`trust-center/src/constants/brandDefaults.ts`** and flow as `--trust-center-header-color` and `--trust-center-accent-color` at runtime.

The in-app reference is **`/design-system`** (`trust-center/src/pages/DesignSystemPage.tsx`).

---

## 1. Canonical hex map (one value, one primary name)

Use the **canonical token** in new code. Other names are aliases of the same hex.

| Hex (normalized) | Canonical token | Same hex also appears as |
|------------------|-----------------|---------------------------|
| #001B28 | `primary-900` | (unique) |
| #204156 | `primary-800` | `--color-foreground`, `--color-popover-foreground`, `--color-primary` |
| #47687D | `primary-700` | `--color-secondary`, `--color-muted-foreground` |
| #86A3B5 | `primary-600` | (unique) |
| #B9C8D2 | `primary-500` | (unique) |
| #DEE7EE | `primary-400` | `--color-border-default`, `--color-border` |
| #EDF3F7 | `primary-300` | `--color-muted` |
| #F4F7F9 | `primary-200` | (unique) |
| #F9FBFC | `primary-100` | `--color-bg-default` |
| #FFFFFF | `surface` | `--color-background`, `--color-popover` |
| #292951 | `trust-icon` (default) | `--trust-center-accent-color`, `TRUST_CENTER_DEFAULT_ACCENT` |
| #333366 | (customer primary) | `--trust-center-header-color`, `TRUST_CENTER_DEFAULT_PRIMARY` |
| #09334E | `icon-default` | (unique, Conveyor shell icons) |
| #1a1040 | `hero-bg` | (unique, hero strip) |
| #6a6a8f | `avatar-bg` | (unique) |
| #2D296D | `ai-text` | (unique) |
| #A78BFA | `purple-300` | (unique) |
| #7C3AED | `purple-500` | (unique) |
| #8969BD | `purple-400` | (unique) |
| #604194 | `purple-600` | (unique) |
| #C8B3E8 | `purple-200` | (unique) |
| #0D7DE4 | `link-400` | (unique) |
| #E6F3FF | `link-100` | (unique) |
| #eff6ff | `link-0` | (unique) |
| #1A9E7A | `brand-600` | (unique) |
| #33C69F | `brand-400` | (unique) |
| #F25D54 | `failure-400` | (unique) |
| #e5e7eb | `grey-1` | (unique) |
| #6b7280 | `grey-600` | (unique) |

**Tailwind usage:** prefer `text-primary-700`, `border-primary-400`, `bg-primary-200`, `text-link-400`, `text-icon-default`, `bg-hero-bg`, `bg-avatar-bg`, `text-ai-text`, `bg-failure-400`, and `var(--color-surface)` for white icons on dark headers.

---

## 2. @theme groups (see `index.css` for full comments)

| Group | Role |
|-------|------|
| **Primary scale** | Text, borders, backgrounds for the Conveyor shell |
| **Brand green** | Live states, success, share CTA |
| **Link blue** | Links, quick link icons, certification links |
| **Purple** | Spaces, designer, AI gradients |
| **Semantic aliases** | `border`, `foreground`, `muted`, `popover`, … same values as rows in section 1 |
| **New product tokens** | `icon-default`, `hero-bg`, `avatar-bg`, `ai-text`, `purple-300`, `purple-500` |
| **Greys** | `grey-1`, `grey-600` where you need neutral gray |
| **Runtime Trust Center** | `--trust-center-header-color`, `--trust-center-accent-color` (set from designer, not customer-editable in this table) |

---

## 3. What not to tokenize

- **Third-party brand colors** in `trustedByLogos` and similar data (Stripe, Shopify, and so on).
- **Fallbacks inside `var(--trust-center-*-color, #hex)`** in JSX. Those hex values are intentional when the variable is unset.

---

## 4. Mask and gradient technical colors

`linear-gradient(#fff 0 0)` in `WebkitMask` / `mask` is a technique for border gradients, not a design token. Leave as `#fff` or `white`.

---

## 5. Implementation status (Trust Center app)

Hardcoded hex values called out in the original audit have been replaced with the tokens above in:

`IdentitySection`, `CertificationsSection`, `DocumentsFAQsSection`, `LeftNav`, `StickyNav`, `HeaderBanner`, `SearchBar`, `AnnouncementsSection`, `WhatWeOfferSection`, `TrustedBySection`, `VideoSection`, `ProductFilterChips`, `DesignerPage`, and global `body` colors in `index.css`.

Tagline gray **#65758b** was consolidated to **`text-primary-700`** (same family as the rest of the product). Tag chip label **#336** (shorthand for **#333366**) was consolidated to **`text-primary-800`** for a single neutral text ramp.

---

## 6. Keeping docs in sync

When you add or change a token in `@theme`:

1. Update **`docs/design-system-audit.md`** section 1 and 2 if the hex or role changed.
2. Update **`DesignSystemPage.tsx`** data arrays if you want the living page to match.
3. Add a short note to **`MEMORY.md`** if the change affects designer or Figma handoff.
