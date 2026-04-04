# Spec: Script Overview Redesign (Notion-Inspired Property Bar)

## Objective
Redesign the `ScriptOverview.tsx` component to replace the oversized "High-Impact" stat block with a minimalist "Property Bar" inspired by Notion. This will significantly reduce vertical space usage and align with a professional financial dashboard aesthetic for voiceover professionals.

## 1. Header Structure (Refinement)
- **Title Row:** Tighten vertical padding (`p="md"` or `p="lg"` instead of `p="xl"`).
- **Verified Badge:** Keep as a dot-badge or small tag next to the title.
- **Actions Group:** Move the "Filter" and "Edit" buttons to be more compact (`size="sm"` or `md`).

## 2. The Property Bar (The Core Feature)
- **Replacement:** Remove the existing three-column `Box` (Hero Stat, Secondary Stat, Tertiary Stat).
- **Layout:** A vertical stack or compact grid of key metrics mimicking Notion's page properties.
- **Properties:**
    - **Billable Words:** Label "Billable Words", Value in `studio` (terracotta) to emphasize financial importance.
    - **Lines Analysis:** Label "Lines", Value showing "X valid" (green-ish) and optional "Y issues" (orange-ish).
    - **Document Scale:** Label "Total Content", Value showing total lines processed.
- **Visuals:** 
    - Labels: `size="xs"`, `c="dimmed"`, `fw={600}`, `tt="uppercase"`, `lts={1}`.
    - Values: `size="sm"`, `fw={700}`, `c="slate.8"`.
    - No background boxes or heavy borders.
    - Icons: Use small Lucide icons (14px) next to labels if needed for visual cues.

## 3. Script Table Integration
- **Separation:** Use a single thin `Divider` or a subtle background change between the header/property bar and the `ScrollArea`.
- **Visibility:** By reducing the header height, more table rows (the primary content) will be visible above the fold.

## 4. Components Involved
- **`ScriptOverviewInner`:** Main layout logic for the header and property bar.
- **`TypeBadge`:** Already simplified, no changes needed unless alignment is affected.
- **`ScriptLineRow`:** Already simplified, no changes needed.

## 5. Testing & Verification
- **Visual Check:** Ensure the "Property Bar" correctly aligns with the "Verified" badge and title.
- **Responsiveness:** Verify the grid/stack wraps cleanly on smaller viewports.
- **Data Integrity:** Confirm metrics (word count, valid lines) still match the `script.overview` data.
