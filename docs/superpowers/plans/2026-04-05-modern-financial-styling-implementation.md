# Modern Financial Styling Guide Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the "Relaxed Option A" styling guide across the application, prioritizing soft elevation, breathable grids, and Inter typography for a trustworthy financial SaaS aesthetic.

**Architecture:** We will update the global CSS and Mantine theme first to establish the foundation (fonts, background, radiuses, shadows). Then, we will iteratively apply Tailwind utility classes to individual components (Authentication, Layout, InvoiceSummary) to realize the design system. 

**Tech Stack:** React, Mantine, Tailwind CSS v4

---

### Task 1: Global Theme & CSS Foundation

**Files:**
- Modify: `src/theme.ts`
- Modify: `src/styles.css`

- [ ] **Step 1: Observe failing design**

*(Visual / Structural change - testing via dev server)*
Run: `npm run dev`
Expected: Background is the default color, cards have standard radiuses and shadows, and the primary color might still be studio instead of wave.

- [ ] **Step 2: Update Mantine Theme**

Read `src/theme.ts`. Modify it to enforce Inter globally, soft radii (`xl` for containers, `lg` for buttons), custom soft shadows, and switch the primary color to `wave` (deep teal) to match the Relaxed Option A spec.

```typescript
// Example snippet to merge into src/theme.ts
export const appTheme = createTheme({
	primaryColor: "wave", // Changed from studio
	colors: {
		studio,
		wave,
	},
	defaultRadius: "xl",
	fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
	headings: {
		fontFamily: "Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
	},
	shadows: {
		sm: "0 2px 10px -3px rgba(0, 0, 0, 0.05)",
		md: "0 4px 15px -5px rgba(0, 0, 0, 0.05)",
		lg: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
	},
	components: {
		Paper: {
			defaultProps: {
				radius: "xl",
				shadow: "sm",
				withBorder: false,
			},
		},
		Button: {
			defaultProps: {
				radius: "lg",
			},
		},
		Modal: {
			defaultProps: {
				centered: true,
				radius: "xl",
				withinPortal: true,
				overlayProps: {
					blur: 3,
					backgroundOpacity: 0.55,
				},
			},
		},
		Table: {
			defaultProps: {
				verticalSpacing: "md",
				horizontalSpacing: "lg",
				highlightOnHover: true,
			},
		},
	},
});
```

- [ ] **Step 3: Update Global CSS**

Read `src/styles.css`. Modify it to use a warm off-white background (`#F9FAFB`) and adjust the default text color to a soft charcoal. Make the gradient subtle by using `studio-1`.

```css
/* Example snippet to merge into src/styles.css */
:root {
	--app-bg: light-dark(#F9FAFB, var(--mantine-color-dark-8));
}

html,
body {
	background: var(--app-bg);
	min-height: 100dvh;
	color: #4B5563; /* Soft Charcoal */
}

body {
	background-image: radial-gradient(
		ellipse 120% 80% at 100% -20%,
		light-dark(
			color-mix(in srgb, var(--mantine-color-studio-1) 35%, transparent),
			color-mix(in srgb, var(--mantine-color-studio-9) 25%, transparent)
		),
		transparent 55%
	);
}
```

- [ ] **Step 4: Verify visually**

Run: `npm run dev` (if not running).
Expected: The background becomes warmer `#F9FAFB`, the font is cleanly `Inter`, primary buttons are deep teal, and cards/modals have `xl` radiuses with softer shadows.

- [ ] **Step 5: Commit**

```bash
git add src/theme.ts src/styles.css
git commit -m "style: update global mantine theme and base css to match soft elevation design"
```

### Task 2: Refactor Authentication Page

**Files:**
- Modify: `src/pages/Authentication.tsx`
- Modify: `src/components/auth/AuthForm.tsx`

- [ ] **Step 1: Observe failing design**

Run: `npm run dev` and navigate to `/login` (or the auth page).
Expected: Layout feels tight, fonts might be default colored, borders might be visible, typography hierarchy is standard.

- [ ] **Step 2: Update Authentication.tsx**

Read `src/pages/Authentication.tsx`. Apply the new padding, shadow (`shadow-sm`), and text colors (`text-gray-800 tracking-tight font-extrabold` for titles) to match the spec.

```tsx
// Apply this style of markup to the main container or Title
<Title order={2} className="text-gray-800 tracking-tight font-extrabold mb-8 text-balance">
  Welcome to InVoice
</Title>
```

- [ ] **Step 3: Update AuthForm.tsx**

Read `src/components/auth/AuthForm.tsx`. Apply soft text to inputs, ensure they have `border-gray-200` and are comfortably tall (`h-11`).

```tsx
// Example modifications for the inputs and buttons
<TextInput
  radius="lg"
  classNames={{ input: "border-gray-200 h-11 focus:border-wave-600" }}
  // ...
/>
<Button
  fullWidth
  radius="lg"
  h={44}
  className="mt-6"
  color="wave"
>
  {isRegister ? "Create Account" : "Sign In"}
</Button>
```

- [ ] **Step 4: Verify visually**

View the Auth page in browser.
Expected: Auth page looks extremely clean, cards float softly with `shadow-[0_2px_10px_-3px_rgba(0,0,0,0.05)]` (via Mantine `shadow="sm"`), inputs are tall and rounded, primary button is deep teal (`wave`), title is heavy and tight.

- [ ] **Step 5: Commit**

```bash
git add src/pages/Authentication.tsx src/components/auth/AuthForm.tsx
git commit -m "style: apply soft elevation and typography to authentication flow"
```

### Task 3: Refactor Invoice Summary (Data Table)

**Files:**
- Modify: `src/features/invoice/summary/InvoiceSummary.tsx`

- [ ] **Step 1: Observe failing design**

Run: `npm run dev` and view an invoice summary or table.
Expected: Standard Mantine table, standard numeric font without tabular alignment.

- [ ] **Step 2: Apply Tabular Nums & Spacing**

Read `src/features/invoice/summary/InvoiceSummary.tsx`. Locate the table rendering or data list, and ensure `tabular-nums` is added to all numeric amounts and dates. Ensure row padding is breathable and bottom borders are faint.

```tsx
// Example modification for table rows or summary list items
<Table.Tr className="hover:bg-gray-50/50 border-b border-gray-100">
  {/* ... */}
  <Table.Td className="text-gray-600 tabular-nums font-medium">
    ${amount.toFixed(2)}
  </Table.Td>
</Table.Tr>
```

- [ ] **Step 3: Verify visually**

View the invoice summary in browser.
Expected: Invoice numbers align perfectly vertically, rows are breathable, text is soft charcoal, and hover states are extremely soft.

- [ ] **Step 4: Commit**

```bash
git add src/features/invoice/summary/InvoiceSummary.tsx
git commit -m "style: apply tabular-nums and breathable spacing to invoice summary"
```