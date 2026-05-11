# Visual QA Checklist

Use this checklist every time Cursor finishes building or changing a section. Open your Figma file side by side with the prototype in your browser and go through each category.

Think of this like a design review, but for code output.

---

## How to use this

1. Open the Figma file in one window and the prototype in another.
2. Navigate to the same section in both.
3. Walk through each category below, checking one item at a time.
4. If something is off, copy the specific checkbox text and paste it into Cursor with a description of what is wrong. For example: "FAIL on Typography #3. The company tagline is using font-weight 400 but it should be 300 (light)."

---

## Layout and Spacing

- [ ] Does the overall page structure match? (Three panels: left nav, center preview, right settings)
- [ ] Are the panel widths proportionally correct? (Left ~200px, right ~300px, center fills remaining)
- [ ] Is the vertical stacking order of sections correct? (Same order as Figma, top to bottom)
- [ ] Are there the right number of columns in multi-column areas? (Company info is 2 columns, FAQ grid is 3 columns)
- [ ] Is the spacing between sections consistent with Figma? (Check the gap between "Certifications" and "Documents & Knowledge Base FAQs" for example)
- [ ] Are cards and containers the right width? (Full-width vs. fixed-width vs. content-width)
- [ ] Is horizontal padding inside cards consistent?
- [ ] Is vertical padding inside cards consistent?

## Typography

- [ ] Is the font family correct? (Should be Inter everywhere in the product UI)
- [ ] Are section titles the right size and weight? (20px bold for "Certifications", "Documents & Knowledge Base FAQs")
- [ ] Is the company name styled correctly? ("Mediacore" 28px bold, thin "|" divider, "Digital media experts" 28px light gray)
- [ ] Are sidebar section headers uppercase and small? ("KNOWLEDGE", "SPACES" at 11px semibold, gray)
- [ ] Are body paragraphs the right size? (14px regular, gray-700)
- [ ] Is the font weight visually distinguishable where it should be? (Bold headings should look heavier than regular text)
- [ ] Are stat pill labels the right size? (13px medium)
- [ ] Do links look like links? (Teal colored, medium weight)

## Colors

- [ ] Is the top nav bar the right dark navy? (#1E1B4B, not black, not gray)
- [ ] Is the main content background the right light gray? (#F3F4F6, not white, not dark gray)
- [ ] Are cards white with the correct border color? (#FFFFFF bg, #E5E7EB border)
- [ ] Are links and interactive elements teal? (#0D9488, not blue, not green)
- [ ] Is the selected nav item highlighted with the light teal background? (#E6FFFA)
- [ ] Is the "All Products" pill dark navy? (#1E1B4B, same as nav bar)
- [ ] Is the live banner the right mint/green? (#ECFDF5 background, #065F46 text)
- [ ] Are the brand color pickers showing #DEE7EE (light gray-blue), not teal?
- [ ] Is the toggle switch teal when ON? (#0D9488)
- [ ] Is the yellow callout box the right warm yellow? (#FFFBEB background)
- [ ] Are muted text elements gray, not black? (#6B7280)

## Icons

- [ ] Are all icons from Google Material Symbols Outlined? (Not MUI, not Lucide, not Heroicons)
- [ ] Is the default icon color #09334E? (Dark navy/teal, not black, not gray)
- [ ] Are top nav icons white? (#FFFFFF)
- [ ] Are link/interactive icons teal? (#0D9488)
- [ ] Are the icons the right size? (14px for stat pills, 16px for sidebar/layout, 20px for top nav)
- [ ] Does each icon match the correct Material Symbol name? (Cross-reference with the icon map in cursor-fix-icons-colors-fonts.md)
- [ ] Are icons vertically centered with their adjacent text?
- [ ] Is the icon optical size correct? (opsz 20 for 16px icons, opsz 24 for 24px icons)

## Interactive Elements

- [ ] Does the selected nav item ("Designer") have the teal highlight?
- [ ] Do nav items show a hover state?
- [ ] Does the Go Live toggle switch between on/off states?
- [ ] Do the "Modern Landing" / "Simple form" thumbnails toggle selection?
- [ ] Are the "Customize Layout" items draggable? (Drag handles visible)
- [ ] Do the visibility (eye) icons toggle on/off?
- [ ] Do the filter pills ("All Products", "Cloud Product", etc.) switch selection?
- [ ] Are the "Documents" and "Knowledge Base FAQs" cards expandable/collapsible?
- [ ] Do FAQ category cards respond to clicks?
- [ ] Do Quick Links behave as clickable links?
- [ ] Is the "Save changes" link clickable?
- [ ] Does the search bar accept input?

## Content Accuracy

- [ ] Are the stat numbers correct? (28 Documents, 57 FAQs, 6 Certifications, Active: 8 minutes ago)
- [ ] Are all certification/badge names present and labeled correctly?
- [ ] Are all Quick Links present? (Mediacore Homepage, Privacy Policy, Status Page, Report a vulnerability)
- [ ] Are all filter pill labels present and in the right order?
- [ ] Are all "Customize Layout" items present and in the right order?
- [ ] Is the company description text accurate?
- [ ] Is the email link correct? (trust@mediacore.com)

---

## Quick severity guide

When reporting issues to Cursor, label them so it knows what to prioritize:

- **BLOCKER**: Wrong layout structure, missing entire sections, broken navigation
- **HIGH**: Wrong colors on major elements, wrong icon library, wrong font family
- **MEDIUM**: Wrong font weight, wrong spacing, icon size off by a few pixels
- **LOW**: Minor alignment tweaks, hover state missing, subtle color shade difference
