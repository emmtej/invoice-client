# Modern Financial Styling Guide (2026)
**Date:** April 5, 2026
**Topic:** App UI/UX Redesign & Styling Guide
**Status:** Approved for Implementation

## Overview
This document establishes the styling guide and UI/UX conventions for the InVoice client application. The goal is to move away from a "generic techy" feel and adopt a warm, approachable, and highly trustworthy aesthetic inspired by modern financial SaaS platforms like Gusto. 

The design prioritizes "Soft Elevation," generous whitespace, and highly legible typography over harsh lines and complex layouts. It uses Mantine UI as the base, heavily customized via Tailwind CSS to achieve the required aesthetic.

---

## 1. Typography (The Gusto Approach)

To create a warm, human, yet professional feel, we rely entirely on **Inter** for all text elements. The personality comes from spacing and color contrast, not quirky letterforms.

- **Primary Font Family:** Inter (Headings, Body, Labels, UI)
- **Data Font Feature:** `tabular-nums` must be enabled for all numeric data (invoices, dates, amounts) to ensure columns align perfectly.

### Hierarchy Rules
- **Page Titles:** Large (`text-4xl` to `text-5xl`), Extra-Bold (`font-extrabold`), tight tracking (`tracking-tight`), using `text-balance` to prevent orphans.
- **Section Headers:** Medium (`text-xl` to `text-2xl`), Semi-Bold (`font-semibold`).
- **Body Text:** Slightly larger than standard (`text-[15px]` or `text-base`), Regular weight (`font-normal`), using `text-pretty` for comfortable reading.
- **Data Labels:** Small (`text-sm`), uppercase (`uppercase`), slightly wide letter-spacing (`tracking-wider`), subdued color.

### Text Colors
- **Never use pure black (`#000000`).**
- **Strong Headings/Titles:** Deep Charcoal (`#1F2937` or Tailwind `gray-800`).
- **Body Text:** Soft Charcoal/Gray (`#4B5563` or `#606060`).
- **Muted/Secondary Text:** Lighter Gray (`#6B7280` or Tailwind `gray-500`).

---

## 2. Colors & Surfaces (Relaxed & Approachable)

We employ a "Relaxed Option A" approach to the brand palette. The app uses the core terracotta and teal colors generously enough to provide energy, but restrains them to interactive elements and accents so the primary focus remains on the financial data.

### The Canvas & Containers
- **App Background (The Canvas):** Very soft, warm off-white (`#F9FAFB` or a 2% tint of terracotta). This reduces eye strain compared to pure white.
- **Cards, Modals, Invoices (The Surfaces):** Pure white (`#FFFFFF`).

### Brand Palette Usage
- **Primary Action (Teal / `wave`):**
  - **Hex:** `wave[8]` (approx. `#185a52` or `#116D6C` equivalent).
  - **Usage:** Main CTA buttons ("Create Invoice", "Save"), active navigation states, focus rings, primary links.
- **Secondary / Accent (Terracotta / `studio`):**
  - **Hex:** `studio[6]` or `studio[7]` (approx. `#c45d3e` or `#a34a32`).
  - **Usage:** Warning states, secondary badges, illustrations, subtle background tints for alert boxes.
- **Destructive / Error:** Soft Red (e.g., `#DA6966`).
- **Success:** Soft Green (e.g., `#059669`).

---

## 3. Elevation & Borders (Soft Elevation)

We avoid harsh borders in favor of soft shadows to create depth and structure.

- **Cards & Modals:**
  - **Shadows:** Very soft, diffused drop shadows (e.g., `shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]`).
  - **Corners:** Slightly larger radiuses (`rounded-xl` or `12px`-`16px` border-radius) for a friendly feel.
  - **Borders:** If a border is absolutely necessary for contrast, it must be extremely faint (`border-gray-100` or `border-gray-200`).
- **Inputs & Forms:**
  - Subtle borders (`border-gray-200`).
  - Soft rounded corners (`rounded-lg`).
  - Slightly taller heights (e.g., `h-11` or `h-12`) for easier clicking.
  - Active states feature a soft Teal focus ring.

---

## 4. Layout & Spacing (The Breathable Grid)

- **Base Grid:** 8px (`0.5rem`) system.
- **Whitespace:** Extremely generous. Margins between major sections should be large (e.g., `mb-8`, `mb-12`) to let content breathe and reduce cognitive overload.
- **Data Tables (Invoices):**
  - Generous row padding (`py-4`).
  - Faint bottom borders (`border-b border-gray-100`).
  - Row hover states: Nearly invisible gray/teal tint (`hover:bg-gray-50/50`).

---

## 5. Implementation Strategy (Mantine + Tailwind)

1. **Mantine Theme Override:**
   - Update `theme.ts` to enforce the new typography (Inter globally), default radiuses (`xl` for modals/cards), and remove default harsh borders on components like `Paper` and `Card`.
   - Override default Mantine shadows with the custom "soft elevation" shadow variables.
2. **Tailwind Integration:**
   - Utilize Tailwind utility classes for layout spacing, text colors, and ad-hoc typography alignment (`tabular-nums`, `text-balance`).
3. **Component Refactoring:**
   - Apply these rules to core layout components (Sidebar, Navbar, Main Content Area).
   - Refactor `AuthForm` and `Authentication` page to reflect the new surface and typography guidelines.
   - Update `InvoiceSummary` and table rows to incorporate the breathable grid and soft hover states.

---
*End of Spec*
