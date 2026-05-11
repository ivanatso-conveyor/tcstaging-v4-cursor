# Getting Started: Your Complete Toolkit

This is your map to everything we have set up. Bookmark this file.

---

## What is in your project folder

Here is every file and what it does:

```
staging-prototype-v1/
|
|-- .cursorrules              <-- Cursor reads this automatically.
|                                 Contains your rules for how Cursor should
|                                 behave, build components, manage tokens,
|                                 and communicate with you.
|
|-- MEMORY.md                 <-- Cursor's long-term memory.
|                                 Updated every session with decisions,
|                                 tokens, Figma references, and your
|                                 preferences. Read this if you forget
|                                 what was decided.
|
|-- docs/
|   |-- getting-started-guide.md      <-- You are here.
|   |-- visual-qa-checklist.md        <-- Use after Cursor builds each section.
|   |-- figma-to-code-glossary.md     <-- Translate Figma terms to code terms.
|   |-- prompt-templates.md           <-- Copy-paste prompts for common tasks.
|
|-- cursor-prompt-trust-center.md         <-- The original master prompt (31 questions).
|-- cursor-additional-instructions.md     <-- Detailed three-panel layout specs.
|-- cursor-fix-icons-colors-fonts.md      <-- Exact icon, color, and font specs.
|
|-- Image assets/
|   |-- Mediacore Logo.png         <-- Real logo from your Figma file
|   |-- TC Banner Image.png        <-- Real hero banner background
|   |-- Modern Landing.png         <-- Public View thumbnail
|   |-- Simple Form.png            <-- Public View thumbnail
|   |-- badges/                    <-- Certification badge SVGs (placeholders)
|   |-- banners/                   <-- Hero banner SVG (backup)
|   |-- icons/                     <-- UI icon SVGs (placeholders)
|   |   |-- figma/                 <-- Download script + guide for real Figma icons
|   |-- logos/                     <-- Mediacore logo SVGs (backups)
|   |-- thumbnails/                <-- Preview thumbnail SVGs (backups)
```

---

## Your workflow: step by step

### When starting a new Cursor session:

1. Open your project folder in Cursor.
2. Paste the "Starting a New Session" prompt from `docs/prompt-templates.md`.
3. Make sure the Figma MCP is connected.
4. Tell Cursor what you want to work on.

### When Cursor builds something:

1. Look at the result in your browser.
2. Open Figma to the same section.
3. Walk through `docs/visual-qa-checklist.md` to compare them.
4. For anything that is off, grab the matching prompt from `docs/prompt-templates.md` and fill in the details.

### When you do not know the code term for something:

1. Open `docs/figma-to-code-glossary.md`.
2. Find the Figma term you know.
3. Use the code equivalent when talking to Cursor.
4. Or just describe it in Figma terms. The `.cursorrules` file tells Cursor to understand Figma language.

### When Cursor uses the wrong icon:

1. Go to https://fonts.google.com/icons
2. Filter by "Material Symbols" and "Outlined"
3. Search for what you need (e.g., "bell" finds "notifications")
4. Copy the icon name
5. Use the "Fixing an Icon" prompt template

---

## Common mistakes and how to avoid them

**Cursor uses the wrong icon library**
The `.cursorrules` file forbids this, but if it happens, say: "You are using the wrong icon library. Only use Google Material Symbols Outlined loaded from the Google Fonts CDN. Check the rules in .cursorrules."

**Colors look washed out or wrong**
Probably mixing up the two color systems. Say: "You are applying customer brand colors (#DEE7EE) to the Conveyor UI elements. The UI uses teal (#0D9488) for links and interactive elements. Check the color token map in MEMORY.md."

**Cursor hardcodes a color or font size directly**
Say: "You hardcoded [VALUE] directly in this component. Check if there is an existing token for this value. If not, create one. See the token rules in .cursorrules."

**Cursor creates a duplicate component instead of extending an existing one**
Say: "This looks very similar to [EXISTING COMPONENT]. Can you add a variant prop to that component instead of creating a new one? Like a component variant in Figma."

**The output is very different from Figma**
Use the "Matching a Figma Frame Exactly" prompt template. Or pull a screenshot with the Figma MCP and paste it directly into Cursor alongside a screenshot of what the prototype currently looks like.

**Cursor installs a package you did not ask for**
The rules say it must ask first. If it does not, say: "You installed [PACKAGE] without asking. Please explain why it is needed and whether there is a simpler alternative. Check the rules in .cursorrules."

---

## Tips for faster progress

1. **Work section by section.** Do not ask Cursor to build the entire page at once. Build the top nav, review it, then the hero banner, review it, then the company info, and so on. Smaller pieces are easier to get right.

2. **Always include a Figma reference.** The more specific you are about where to look in Figma, the better the output. A node ID or URL is ideal.

3. **Screenshot and compare.** Take a screenshot of the Figma frame and the prototype, put them side by side, and paste both into Cursor. Visual comparisons are worth a thousand words.

4. **Say "check MEMORY.md" when Cursor seems to forget.** It might lose context in long sessions. Reminding it to re-read the memory file resets it.

5. **Update MEMORY.md yourself if needed.** If you notice Cursor keeps making the same mistake, open MEMORY.md and add a note under "My Preferences." For example: "Never use rounded-none on cards. All cards should have rounded-lg."

6. **Use the QA checklist as a habit.** It feels slow at first, but catching issues early saves hours of back-and-forth later.
