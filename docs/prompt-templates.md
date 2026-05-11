# Prompt Templates for Cursor

Copy and paste these into Cursor whenever you need to do one of these common tasks. Fill in the [BRACKETS] with your specific details.

---

## Building a New Section

Use this when you want Cursor to build a new part of the UI from a Figma frame.

```
Build the [SECTION NAME] section of the Trust Center.

Figma reference: [PASTE FIGMA URL OR DESCRIBE THE FRAME LOCATION]

Before you start:
1. Pull the design from Figma MCP (file key: U3ZtAQwW5Wz7xQ9RFJejJc, node: [NODE ID]).
2. Check design-tokens.ts for existing tokens that match the colors, fonts, and spacing in this section.
3. Check src/components/ for existing components you can reuse.

Build it step by step. After each step, show me what you built and compare it to the Figma reference. Do not move to the next step until I confirm the current one looks right.

Remember: use the shared Icon component for all icons, reference tokens for all style values, and add a Figma reference comment at the top of any new component file.
```

---

## Fixing a Color, Font, or Spacing Issue

Use this when something looks wrong and you can see what it should be in Figma.

```
The [ELEMENT DESCRIPTION] has the wrong [color / font size / font weight / spacing / icon].

Current (wrong): [DESCRIBE WHAT IT LOOKS LIKE NOW]
Expected (from Figma): [DESCRIBE WHAT IT SHOULD LOOK LIKE]

The correct value should be [EXACT VALUE, e.g., "#0D9488" or "font-weight 600" or "gap 16px"].

Check if there is an existing token for this value. If so, use the token. If not, create a new token with a descriptive name and tell me about it.

Which file do I need to change?
```

---

## Matching a Figma Frame Exactly

Use this when you want Cursor to do a pixel-level comparison.

```
Compare the current [SECTION NAME] with the Figma design and fix every difference.

Figma reference: [PASTE FIGMA URL OR NODE ID]

Go through this checklist for the section:
1. Layout structure (number of columns, stacking order, alignment)
2. Spacing (padding inside containers, gaps between items)
3. Typography (font size, weight, color, letter spacing for every text element)
4. Colors (backgrounds, borders, text colors, icon colors)
5. Icons (correct Material Symbol name, correct size, correct color)
6. Border radius and borders
7. Interactive states (hover, selected, toggle)

For each difference you find, tell me:
- What is wrong
- What it should be
- Which file you are changing
- Which token you are using (or creating)

Fix them one at a time so I can verify each change.
```

---

## Adding a New Component

Use this when you need a new reusable piece of the UI.

```
Create a new [COMPONENT NAME] component.

This component is used in: [WHERE IT APPEARS IN THE UI]
Figma reference: [FRAME LOCATION OR URL]

It should accept these settings (props):
- [PROP 1 NAME]: [WHAT IT CONTROLS] (example: label: the text that shows, like "28 Documents")
- [PROP 2 NAME]: [WHAT IT CONTROLS]
- [ADD MORE AS NEEDED]

Before creating it:
1. Check if a similar component already exists that could be extended with a new variant instead.
2. Use tokens for all style values.
3. Use the shared Icon component if it includes an icon.
4. Add a comment header with the Figma reference.
5. Put the file in the correct folder (shared/, trust-center/, settings/, or layout/).

Show me the component code and an example of how to use it before you save the file.
```

---

## Making Something Responsive

Use this when the prototype needs to work at different screen sizes.

```
Make the [SECTION NAME] responsive.

Right now it is designed for desktop (~1280px wide). I need it to also work at:
- Tablet width (~768px): [DESCRIBE WHAT SHOULD CHANGE, e.g., "sidebar collapses to icons only" or "grid goes from 3 columns to 2"]
- Mobile width (~375px): [DESCRIBE WHAT SHOULD CHANGE, e.g., "sidebar becomes a hamburger menu" or "cards stack vertically"]

Use Tailwind responsive prefixes (sm:, md:, lg:) rather than custom media queries. Show me each breakpoint so I can check the layout at each size.
```

---

## Fixing an Icon

Use this when the wrong icon is showing.

```
The icon for [ELEMENT DESCRIPTION] is wrong.

Current (wrong): [WHAT ICON IS SHOWING, or "a random icon" or "no icon"]
Expected: Material Symbol name "[CORRECT NAME]" at [SIZE]px in color [COLOR HEX]

Use the shared Icon component:
<Icon name="[CORRECT NAME]" size={[SIZE]} color="[COLOR HEX]" />

The icon should be from Google Material Symbols Outlined (FILL 0, weight 400, grade 0). If you are not sure the name is correct, search at https://fonts.google.com/icons with "Material Symbols" and "Outlined" filters.
```

---

## Adding Interactivity

Use this when you need a click, toggle, hover, or animation to work.

```
Add [INTERACTION TYPE] to the [ELEMENT DESCRIPTION].

What should happen:
- Trigger: [WHAT THE USER DOES, e.g., "clicks the toggle", "hovers over the nav item", "clicks a filter pill"]
- Result: [WHAT SHOULD CHANGE, e.g., "the toggle switches from off to on and changes color to teal", "the nav item background becomes light gray", "the clicked pill gets selected and the others deselect"]
- Animation: [OPTIONAL, e.g., "smooth transition over 150ms" or "no animation, instant change"]

Figma reference: [IF THERE ARE PROTOTYPE INTERACTIONS SET UP IN FIGMA, MENTION THEM]

Walk me through the change step by step. Explain what a "state" is if you need to create one.
```

---

## Starting a New Session

Use this at the beginning of every new Cursor session to get it back up to speed.

```
I am continuing work on the Trust Center prototype.

Before doing anything:
1. Read MEMORY.md for past decisions, tokens, and preferences.
2. Read .cursorrules for how to communicate with me and how to structure code.
3. Give me a brief summary of where we left off and what is done vs. what still needs work.

I am a product designer, not a developer. Explain things step by step using Figma terminology where it helps. Do not use em dashes.
```

---

## Debugging When Something Breaks

Use this when the prototype shows an error or something stops working.

```
Something is broken. Here is what I see:

[DESCRIBE THE PROBLEM, e.g., "the page is blank", "there is a red error message", "the sidebar disappeared", "the icons are all showing as squares"]

[IF THERE IS AN ERROR MESSAGE, PASTE IT HERE]

Please:
1. Explain what went wrong in plain language (no jargon).
2. Tell me what caused it.
3. Fix it.
4. Explain what you changed so I understand for next time.
```

---

## Exporting or Deploying the Prototype

Use this when you want to share the prototype with clients.

```
I want to deploy this prototype so I can share a live URL with clients for testing.

Please:
1. Check that all dependencies are installed and the project builds without errors.
2. Tell me the simplest way to deploy (Vercel is preferred).
3. Walk me through each step. I have not done this before.
4. Make sure the deployed version uses the correct fonts (Inter and Material Symbols) from CDN.
```
