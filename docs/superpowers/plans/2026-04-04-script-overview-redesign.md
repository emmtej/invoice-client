# Script Overview Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the `ScriptOverview.tsx` component to replace the oversized "High-Impact" stat block with a minimalist "Property Bar" inspired by Notion database properties.

**Architecture:** This is a UI-only update. We'll restructure the header to use a compact grid for metrics, significantly reducing the vertical footprint and enhancing the "financial dashboard" aesthetic.

**Tech Stack:** React, Mantine UI, Tailwind CSS, Lucide Icons.

---

### Task 1: Clean Up Header and Prepare Property Bar Container

**Files:**
- Modify: `src/features/editor/components/ScriptOverview.tsx`

- [ ] **Step 1: Tighten Header Padding**
  Reduce the vertical padding of the main header `Box`.
  Change:
  ```tsx
  <Box p="xl" className="border-b border-slate-100 bg-white sticky top-0 z-20">
  ```
  To:
  ```tsx
  <Box p="lg" className="border-b border-slate-100 bg-white sticky top-0 z-20">
  ```

- [ ] **Step 2: Update Title Row Layout**
  Make the title row more compact and ensure it aligns well with the filter/edit buttons.
  Change:
  ```tsx
  <Flex justify="space-between" align="center" mb={40} gap="xl">
  ```
  To:
  ```tsx
  <Flex justify="space-between" align="flex-start" mb={24} gap="xl">
  ```

- [ ] **Step 3: Simplify Verified Badge and Metadata**
  Remove the heavy text analysis row and replace it with something more breadcrumb-like or breadcrumb-adjacent.
  Change:
  ```tsx
  <Group gap="xs">
      <Text size="xs" c="dimmed" fw={700} tt="uppercase" lts={1.5}>
          Document Analysis
      </Text>
      <Box className="w-1 h-1 rounded-full bg-slate-300" />
      <Text size="xs" c="studio.6" fw={800} tt="uppercase" lts={1.5}>
          {overview.totalLines} Lines Total
      </Text>
  </Group>
  ```
  To:
  ```tsx
  <Group gap="xs">
      <Badge variant="dot" color="studio" size="sm">
          {overview.totalLines} Lines
      </Badge>
  </Group>
  ```

- [ ] **Step 4: Commit**
  ```bash
  git add src/features/editor/components/ScriptOverview.tsx
  git commit -m "style(editor): tighten ScriptOverview header and simplify title row"
  ```

---

### Task 2: Implement the "Property Bar"

**Files:**
- Modify: `src/features/editor/components/ScriptOverview.tsx`

- [ ] **Step 1: Remove "High-Impact Stat Section"**
  Delete the existing `Box` containing the three-column word count stats.

- [ ] **Step 2: Add the minimalist Property Bar**
  Insert the new property-based grid layout.
  ```tsx
  {/* Notion-style Property Bar */}
  <Stack gap={8} className="max-w-md">
      <Group gap={0} wrap="nowrap" className="text-xs">
          <Box w={140} className="flex items-center gap-2 text-slate-500 font-semibold uppercase tracking-wider">
              <MessageSquare size={14} strokeWidth={2} />
              <span>Billable Words</span>
          </Box>
          <Text fw={800} size="sm" className="text-studio-600 tabular-nums">
              {overview.wordCount} words
          </Text>
      </Group>

      <Group gap={0} wrap="nowrap" className="text-xs">
          <Box w={140} className="flex items-center gap-2 text-slate-500 font-semibold uppercase tracking-wider">
              <Zap size={14} strokeWidth={2} />
              <span>Valid Content</span>
          </Box>
          <Text fw={700} size="sm" className="text-slate-800">
              {overview.validLines.length} dialogue lines
          </Text>
      </Group>

      <Group gap={0} wrap="nowrap" className="text-xs">
          <Box w={140} className="flex items-center gap-2 text-slate-500 font-semibold uppercase tracking-wider">
              <Search size={14} strokeWidth={2} />
              <span>Health Check</span>
          </Box>
          <Group gap={6}>
              {overview.invalidLines.length > 0 ? (
                  <>
                      <Text fw={700} size="sm" color="orange.6">
                          {overview.invalidLines.length} issues
                      </Text>
                      <Text c="dimmed" size="xs">(requires review)</Text>
                  </>
              ) : (
                  <Text fw={700} size="sm" color="emerald.6">
                      100% Ready
                  </Text>
              )}
          </Group>
      </Group>
  </Stack>
  ```

- [ ] **Step 3: Run tests and verify**
  Check that word counts and valid lines still render correctly.
  Run: `npm run check`

- [ ] **Step 4: Commit**
  ```bash
  git add src/features/editor/components/ScriptOverview.tsx
  git commit -m "feat(editor): implement Notion-style Property Bar in ScriptOverview"
  ```

---

### Task 3: Final Polishing

**Files:**
- Modify: `src/features/editor/components/ScriptOverview.tsx`

- [ ] **Step 1: Simplify Filter and Edit Buttons**
  Ensure the buttons don't feel too "loud" against the new minimalist header.
  Reduce the button/select size if necessary or remove heavy shadows.
  Change:
  ```tsx
  className="shadow-lg shadow-studio-100 hover:scale-[1.02] transition-transform"
  ```
  To:
  ```tsx
  className="hover:scale-[1.01] transition-transform"
  ```

- [ ] **Step 2: Verify Vertical Space Savings**
  Check that the header is now approximately half the original height.

- [ ] **Step 3: Run final checks**
  Run: `npm run check && npm run test`
  Expected: PASS

- [ ] **Step 4: Commit**
  ```bash
  git add src/features/editor/components/ScriptOverview.tsx
  git commit -m "style(editor): final polish for ScriptOverview header"
  ```
