# Figma-to-Code Glossary

A translation guide between Figma concepts you already know and their code equivalents. Use this when talking to Cursor so you can describe what you want using either language.

---

## Layout

| What you call it in Figma | What it is in code | Example |
|--------------------------|-------------------|---------|
| **Frame** | A `<div>` (a container element) | A frame that holds the sidebar content becomes `<div className="sidebar">` |
| **Auto-layout (vertical)** | `display: flex; flex-direction: column;` or Tailwind `flex flex-col` | A vertical stack of nav items |
| **Auto-layout (horizontal)** | `display: flex; flex-direction: row;` or Tailwind `flex flex-row` | The stat pills sitting side by side |
| **Gap (in auto-layout)** | `gap` property, or Tailwind `gap-4` | "Item spacing: 16" in Figma becomes `gap-4` (4 x 4px = 16px) |
| **Padding** | `padding` property, or Tailwind `p-4`, `px-6`, `py-3` | "Padding: 16" becomes `p-4`. "Horizontal padding: 24" becomes `px-6` |
| **Fill container** | `width: 100%` or Tailwind `w-full` | A frame set to "Fill" takes the full width of its parent |
| **Fixed width** | `width: 300px` or Tailwind `w-[300px]` | The right sidebar is a fixed 300px wide |
| **Hug contents** | `width: fit-content` or Tailwind `w-fit` | A button that is only as wide as its text |
| **Constraints (left and right)** | `position: absolute; left: 0; right: 0;` or `w-full` | Pinning something to both edges so it stretches |
| **Constraints (center)** | `margin: 0 auto` or Tailwind `mx-auto` | Centering a container horizontally |
| **Alignment (center, left, right)** | `align-items` and `justify-content` in flexbox | "Align: center" in auto-layout becomes `items-center` |
| **Space between** | `justify-content: space-between` or Tailwind `justify-between` | Pushing items to opposite ends (like "Designer Settings" and "Save changes") |

## Spacing quick reference (Tailwind)

Tailwind uses a 4px base unit. So `gap-2` = 8px, `p-4` = 16px, etc.

| Figma spacing value | Tailwind class | CSS value |
|--------------------|---------------|-----------|
| 4px | `gap-1`, `p-1`, `m-1` | 4px |
| 8px | `gap-2`, `p-2`, `m-2` | 8px |
| 12px | `gap-3`, `p-3`, `m-3` | 12px |
| 16px | `gap-4`, `p-4`, `m-4` | 16px |
| 20px | `gap-5`, `p-5`, `m-5` | 20px |
| 24px | `gap-6`, `p-6`, `m-6` | 24px |
| 32px | `gap-8`, `p-8`, `m-8` | 32px |
| 40px | `gap-10`, `p-10`, `m-10` | 40px |
| 48px | `gap-12`, `p-12`, `m-12` | 48px |

---

## Styling

| What you call it in Figma | What it is in code | Example |
|--------------------------|-------------------|---------|
| **Fill (solid color)** | `background-color` or Tailwind `bg-[#1E1B4B]` | A frame's fill color |
| **Fill (gradient)** | `background: linear-gradient(...)` | The hero banner gradient |
| **Stroke** | `border` property, or Tailwind `border border-gray-200` | A card's outline |
| **Stroke (bottom only)** | `border-bottom` or Tailwind `border-b` | A divider line under a section |
| **Corner radius** | `border-radius` or Tailwind `rounded-lg` | Rounded corners on a card |
| **Corner radius (individual)** | `border-radius: 8px 8px 0 0` or Tailwind `rounded-t-lg` | Rounded only on top |
| **Drop shadow** | `box-shadow` or Tailwind `shadow-sm` | A subtle shadow on a card |
| **Opacity** | `opacity` property or Tailwind `opacity-50` | A faded/disabled element |
| **Blur (layer blur)** | `filter: blur()` or Tailwind `blur-sm` | A blurred background effect |
| **Clip content** | `overflow: hidden` or Tailwind `overflow-hidden` | Content that gets cut off at the frame edge |

## Corner radius quick reference

| Figma radius | Tailwind class | Typical use |
|-------------|---------------|------------|
| 0 | `rounded-none` | Sharp corners |
| 2px | `rounded-sm` | Subtle rounding |
| 4px | `rounded` | Default rounding |
| 6px | `rounded-md` | Cards, inputs |
| 8px | `rounded-lg` | Larger cards, modals |
| 12px | `rounded-xl` | Prominent cards |
| 16px | `rounded-2xl` | Large panels |
| Full circle | `rounded-full` | Avatars, pills, badges |

---

## Components

| What you call it in Figma | What it is in code | Example |
|--------------------------|-------------------|---------|
| **Component** | A React component (a reusable `.tsx` file) | Your "StatPill" component in Figma becomes `StatPill.tsx` |
| **Instance** | Using the component somewhere: `<StatPill />` | Placing the stat pill on the page |
| **Component property** | A "prop" passed to the component | The pill's label ("28 Documents") is a prop: `<StatPill label="28 Documents" />` |
| **Variant** | A prop that switches between styles | `<Button variant="primary" />` vs `<Button variant="secondary" />` |
| **Boolean property** | A true/false prop | `isSelected={true}` toggles the selected look |
| **Text property** | A string prop | `label="Dashboard"` sets the text content |
| **Instance swap** | Passing a different component as a prop | `icon={<Icon name="search" />}` swaps which icon shows |
| **Detach instance** | Overriding the component locally (generally avoided in code too) | In code, you would add custom `className` overrides |
| **Component set** | A group of related variants in one file | Having `primary`, `secondary`, `ghost` variants of Button |

---

## Typography

| What you call it in Figma | What it is in code | Example |
|--------------------------|-------------------|---------|
| **Font family** | `font-family` or Tailwind `font-sans` | Inter is set as the default sans font |
| **Font size** | `font-size` or Tailwind `text-sm`, `text-base`, `text-lg` | 14px in Figma is `text-sm` in Tailwind |
| **Font weight: Thin** | `font-weight: 200` or Tailwind `font-extralight` | The "|" divider |
| **Font weight: Light** | `font-weight: 300` or Tailwind `font-light` | "Digital media experts" |
| **Font weight: Regular** | `font-weight: 400` or Tailwind `font-normal` | Body text |
| **Font weight: Medium** | `font-weight: 500` or Tailwind `font-medium` | Nav items, links |
| **Font weight: Semi Bold** | `font-weight: 600` or Tailwind `font-semibold` | Section headers, labels |
| **Font weight: Bold** | `font-weight: 700` or Tailwind `font-bold` | "Mediacore", page titles |
| **Letter spacing** | `letter-spacing` or Tailwind `tracking-wide` | The uppercase section headers have wider tracking |
| **Line height** | `line-height` or Tailwind `leading-normal`, `leading-tight` | Controls space between lines of text |
| **Text transform: Uppercase** | `text-transform: uppercase` or Tailwind `uppercase` | "KNOWLEDGE", "SPACES", "QUICK LINKS" |
| **Text decoration: Underline** | `text-decoration: underline` or Tailwind `underline` | Linked text like "trust@mediacore.com" |
| **Text color** | `color` property or Tailwind `text-gray-700` | Paragraph text is gray-700 (#374151) |

## Tailwind font size reference

| Figma size | Tailwind class | Actual size |
|-----------|---------------|-------------|
| 11px | `text-[11px]` (custom) | 11px |
| 12px | `text-xs` | 12px |
| 13px | `text-[13px]` (custom) | 13px |
| 14px | `text-sm` | 14px |
| 16px | `text-base` | 16px |
| 18px | `text-lg` | 18px |
| 20px | `text-xl` | 20px |
| 24px | `text-2xl` | 24px |
| 28px | `text-[28px]` (custom) | 28px |
| 30px | `text-3xl` | 30px |

---

## States and Interactions

| What you call it in Figma | What it is in code | Example |
|--------------------------|-------------------|---------|
| **Default state** | No special class, just the base styles | How a button looks normally |
| **Hover state** | Tailwind `hover:bg-gray-100` | Background changes when mouse is over it |
| **Pressed/Active state** | Tailwind `active:bg-gray-200` | Brief flash when clicking |
| **Focused state** | Tailwind `focus:ring-2 focus:ring-teal-500` | Blue/teal ring when tabbing to an input |
| **Disabled state** | Tailwind `opacity-50 cursor-not-allowed` | Grayed out, cannot interact |
| **Selected state** | A conditional class: `isSelected ? 'bg-teal-50' : ''` | The "Designer" nav item's teal background |
| **Toggle on/off** | A boolean state variable: `const [isOn, setIsOn] = useState(false)` | The Go Live toggle switch |
| **Prototype link (navigate to)** | React Router: `<Link to="/settings">` or `onClick` handler | Clicking a nav item goes to another page |
| **Open overlay** | A modal state: `const [isOpen, setIsOpen] = useState(false)` | Opening a dialog or dropdown |
| **Swap with (component)** | Conditional rendering: `{isExpanded ? <ExpandedView /> : <CollapsedView />}` | Expanding the Documents section |

---

## Talking to Cursor: Translation examples

Here are some things you might say in Figma terms and how to phrase them for Cursor:

| What you might say | How to tell Cursor |
|-------------------|-------------------|
| "This frame needs more padding" | "Increase the padding inside this container. It should be 24px on all sides, matching the Figma frame." |
| "These items need auto-layout horizontal with 12px gap" | "These items should be in a horizontal flex row with a 12px gap between them." |
| "The text layer is using Inter Semi Bold 14" | "This text should use font-family Inter, font-size 14px, font-weight 600 (semibold)." |
| "This component has a variant for 'selected'" | "This component needs a prop called `isSelected`. When true, apply the selected styles (teal background, teal text)." |
| "The stroke is 1px gray-200 on the bottom only" | "Add a bottom border: 1px solid, using the card-border token (#E5E7EB)." |
| "This should fill the container width" | "This element should be full width (`w-full`)." |
| "Corner radius 8 on this card" | "Set border-radius to 8px (`rounded-lg`) on this card." |
| "I want to swap this icon instance" | "Change the icon prop on this component from `search` to `notifications`." |
