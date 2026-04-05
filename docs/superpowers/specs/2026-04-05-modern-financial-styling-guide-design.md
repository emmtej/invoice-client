# Modern Financial Styling Guide (2026)

**Date:** April 5, 2026  
**Topic:** App UI/UX Redesign & Styling Guide  
**Status:** Approved for Implementation

## Overview

This document establishes styling and UI conventions for the InVoice client. The goal is to move away from a generic “tech product” look toward a **warm, approachable, and trustworthy** financial SaaS aesthetic.

Public materials on Gusto’s identity describe a deliberate balance: **warmth** (care, humanity) and **sophistication** (trust in money and compliance). That balance shows up in generous whitespace, a vibrant but disciplined palette, illustration with a human hand, and a **two-family typography system**—not a single utility sans everywhere. We take **inspiration** from that direction; InVoice keeps its own terracotta/teal brand colors and implementation stack (Mantine + Tailwind). The current product direction also uses **sharp, square corners everywhere** so softness comes from spacing, type, and shadow rather than rounded geometry.

**Stack:** Mantine as the component base, customized so Tailwind can express spacing, type roles, and surfaces consistently.

---

## 1. Typography (Gusto-Inspired Roles)

Gusto’s published rebrand work describes a flexible system: **display headlines** use a warm, distinctive serif (**ITC Clearface**); **product and long-form UI** use a contemporary, approachable sans (**Centra**—on the web, [Typewolf](https://www.typewolf.com/site-of-the-day/gusto) lists **Centra No2** alongside Clearface). A tertiary hand-drawn style appears only for rare accent moments. The lesson for InVoice: **personality comes from pairing and spacing**, not from one monospace or one neo-grotesk for every string.

### 1.1 Font roles (what to use where)

| Role | Gusto reference | InVoice implementation |
|------|-----------------|---------------------------|
| **Display / hero / major marketing-style titles** | ITC Clearface | **Preferred:** ITC Clearface if licensed. **Fallback (open):** [Source Serif 4](https://fonts.google.com/specimen/Source+Serif+4), [Fraunces](https://fonts.google.com/specimen/Fraunces), or [Lora](https://fonts.google.com/specimen/Lora)—warm, readable serifs that support a “human, not bank lobby” headline. |
| **App chrome, body, tables, forms, labels** | Centra (No2) | **Preferred:** Centra No2 if licensed. **Fallback:** [Inter](https://fonts.google.com/specimen/Inter)—excellent UI coverage and `font-feature-settings`; or [DM Sans](https://fonts.google.com/specimen/DM+Sans) / [Plus Jakarta Sans](https://fonts.google.com/specimen/Plus+Jakarta+Sans) for a slightly rounder, friendlier sans closer to Centra’s tone. |
| **Numeric data** | Same sans as UI, tabular alignment | **Required:** `font-variant-numeric: tabular-nums` (Tailwind: `tabular-nums`) on amounts, dates, invoice lines, and any columnar numbers so decimals and digits align. |

Use **one sans family** across the product surface for cohesion; use the **serif only** for top-level page titles and hero-style blocks where you want Gusto-like “editorial” warmth—not for dense tables or small UI chrome. For the current implementation, standardize on **Source Serif 4** for display/page titles and **Inter** for UI/body text unless licensed replacements are adopted later.

### 1.2 Hierarchy (sizes & weights)

- **Display / primary page title (serif):** Large scale (`text-4xl`–`text-5xl` range), **semibold to bold** (not necessarily `font-black`—Clearface-like serifs read strong without extreme weight). Use `tracking-tight` and `text-balance` to control orphans.
- **Section headings (sans):** `text-xl`–`text-2xl`, **`font-semibold`**.
- **Body (sans):** Slightly generous for finance readability: `text-[15px]` or `text-base`, **`font-normal`**, comfortable line height (`leading-relaxed` where paragraphs run long). Prefer `text-pretty` for marketing blocks; keep product copy scannable.
- **Labels & meta (sans):** `text-sm`, **uppercase** only where it aids scan (e.g. column headers, filters), with **`tracking-wide` or `tracking-wider`** and muted color—not uppercase for long sentences.

### 1.3 Text color (no pure black)

- **Never use pure `#000000`** for UI text on light surfaces.
- **Strong titles (sans or serif):** Deep charcoal (`#1F2937` / `gray-800`).
- **Body:** Soft charcoal (`#4B5563`–`#606060`).
- **Secondary / helper / placeholders:** `gray-500`–`gray-600` (`#6B7280` range).

---

## 2. Colors & Surfaces (Relaxed & Approachable)

Gusto’s public palette story centers **warm accent (e.g. “Guava”)**, **deep green (“Kale”)**, and **lots of white space**—energy without shouting. InVoice already maps that idea onto **terracotta (studio) + teal (wave)** as accent and primary action, with neutrals carrying the layout.

### Canvas & containers

- **App background:** Very soft warm off-white (`#F9FAFB` or a subtle terracotta tint ~2%) to reduce glare vs pure white.
- **Cards, modals, invoice surfaces:** **White** (`#FFFFFF`) with soft shadow (see §3).

### Brand usage

- **Primary action (Teal / `wave`):** e.g. `wave[8]` (~`#185a52` / `#116D6C`). Use for primary CTAs (“Create invoice”, “Save”), key links, active nav, focus rings.
- **Secondary accent (Terracotta / `studio`):** e.g. `studio[6]`–`studio[7]` (~`#c45d3e` / `#a34a32`). Use for secondary emphasis, warm badges, illustration accents, light alert tints—not for body text at large blocks.
- **Destructive:** Soft red (e.g. `#DA6966`).
- **Success:** Soft green (e.g. `#059669`).

Keep **high-value numbers** in neutral or semantic colors; use brand accents for **actions and wayfinding**, not for every numeric cell.

---

## 3. Elevation & Borders (Soft Elevation, Sharp Geometry)

Prefer **depth from shadow** over heavy outlines—aligned with a calm, “human” product feel.

- **Cards & modals:** Soft, diffuse shadow (e.g. `shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]` or theme tokens). **No rounded corners**: containers, controls, badges, avatars, and segmented UI should all stay square. If a border is needed, keep it light: `border-gray-100` / `border-gray-200`.
- **Inputs:** `border-gray-200`, **square corners**, comfortable height (`h-11` / `h-12`). Focus: visible **teal-tinted** ring for accessibility.

---

## 4. Layout & Spacing (Breathable Grid)

- **Base unit:** 8px (0.5rem).
- **Vertical rhythm:** Generous gaps between major sections (`mb-8`, `mb-12` or equivalent) so dashboards and invoice views don’t feel cramped.
- **Data tables:** Comfortable row padding (`py-4`), subtle row separators (`border-b border-gray-100`), hover (`hover:bg-gray-50/50` or a whisper of teal) without loud stripes.

---

## 5. Implementation Strategy (Mantine + Tailwind)

1. **Theme (`theme.ts`):** Register **two** font families: `--font-display` (serif stack) and `--font-sans` (UI/body). Default Mantine `fontFamily` to the sans stack; apply the display family only to title components / layout slots you define (e.g. `PageTitle`, marketing hero). Set all radius tokens and component defaults to `0` so buttons, inputs, cards, badges, avatars, and segmented controls stay square.
2. **Tailwind:** Map `font-display` / `font-sans` in config; use utilities for `tabular-nums`, `text-balance`, and spacing. Bridge Mantine brand tokens into Tailwind utilities so `wave-*` and `studio-*` classes resolve to the same palette as the theme.
3. **Components:** Roll rules through shell layout (sidebar, top bar, main), auth surfaces, and **invoice tables / `InvoiceSummary`**—serif on page title, sans everywhere else, tabular numbers on money columns.

---

## 6. References (Public)

- Gusto rebrand case study (typography, palette, philosophy): [Jenna Carando — Gusto Rebrand](https://jennacarando.com/gusto-rebrand)  
- Font pairing note (Clearface + Centra No2): [Typewolf — Gusto](https://www.typewolf.com/site-of-the-day/gusto)  
- Brand overview (high level): [gusto.com/brand](https://gusto.com/brand)

---

*End of spec*
