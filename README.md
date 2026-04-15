# InVoice Client

A modern web application for voiceover professionals to manage scripts and generate word-count-based invoices.

## Project Overview

*   **Purpose:** Streamlines the workflow of voiceover artists by parsing scripts (DOCX/XML/Text), calculating word counts, and generating professional invoices.
*   **Main Technologies:**
    *   **Framework:** React 19 with TypeScript.
    *   **Build Tool:** Vite.
    *   **UI Library:** Mantine UI (v8) with custom "Studio" (terracotta) and "Wave" (teal) design tokens.
    *   **Styling:** Tailwind CSS (v4) for utility-first styling.
    *   **Routing:** TanStack Router (v1) for type-safe navigation.
    *   **State Management:** Zustand for lightweight, decoupled feature state.
    *   **Forms & Validation:** React Hook Form with Zod.
    *   **Rich Text Editing:** Tiptap editor.
    *   **Linting & Formatting:** Biome.
    *   **Testing:** Vitest and React Testing Library.

## Architecture

The project follows a feature-based directory structure within `src/features/`:

*   `auth/`: Authentication logic, providers, and login/register components.
*   `editor/`: Script parsing and rich text editing components/hooks.
*   `invoice/`: Invoice generation, item management, and summary components.
*   `ui/`: Shared, generic UI components (layouts, navbars, sidebars).

Global state is managed via Zustand stores found in `src/store/` (e.g., `userStore`) or within specific feature directories (e.g., `invoiceStore`).

## Data Privacy & Storage

This application is designed to be **local-first** and privacy-preserving:
*   **No Server Database:** All user data, including uploaded scripts, parsed content, and invoice profiles, are stored locally on your device.
*   **Storage Mechanisms:** We use PGLite (Postgres-in-WASM) via IndexedDB for script storage, and `localStorage` for profile/auth persistence.
*   **Retention:** Data persists as long as your browser keeps the local storage data. You can manually clear this data through your browser settings or by using the app's reset options.
*   **Note:** Because data stays local, clearing browser data or using incognito mode means your data will not be saved across sessions. Please export any important invoices or scripts manually.

## Building and Running

### Prerequisites
*   Node.js (latest LTS recommended)
*   npm

### Environment Setup
Create a `.env.local` file in the root directory based on `.env.example`. A `CLIENT_PORT` is required to run the development server.
```bash
cp .env.example .env.local
```

### Commands
*   **Install dependencies:** `npm install`
*   **Start development server:** `npm run dev`
*   **Build for production:** `npm run build`
*   **Run tests:** `npm run test`
*   **Linting & Formatting:**
    *   `npm run lint`: Run Biome linter.
    *   `npm run format`: Run Biome formatter.
    *   `npm run check`: Run both linting and formatting checks.

## Development Conventions

*   **Indentation:** Use **Tabs** for indentation (enforced by Biome).
*   **Quotes:** Use **Double Quotes** for JavaScript/TypeScript strings.
*   **File Naming:** Use PascalCase for React components (e.g., `ButtonLink.tsx`) and camelCase for utilities/hooks (e.g., `useFileUpload.ts`).
*   **State Management:**
    *   Prefer local component state or Mantine hooks for UI-only state.
    *   Use Zustand stores for shared domain logic and persisted data across pages.
*   **Routing:** Always use type-safe routes provided by TanStack Router. Avoid hardcoded strings for links.
*   **Styling:**
    *   Use Mantine components as the foundation.
    *   Use Tailwind CSS for custom layouts and minor adjustments.
    *   Follow the design tokens defined in `src/theme.ts`.
*   **Validation:** Use Zod schemas for API responses and form validation to ensure type safety at runtime.
*   **Testing:** Add unit tests for utility functions and integration tests for complex components using Vitest.