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

*   **`auth/`**: Authentication logic, providers, and login/register components.
*   **`booth/`**: Voiceover booth session management, teleprompter, and recording settings.
*   **`editor/`**: Script parsing, folder management, and rich text editing components/hooks.
*   **`home/`**: Public landing page and marketing components.
*   **`invoice/`**: Invoice generation, item management, and summary components.
*   **`scripts/`**: Script management, file list, and parsing utilities.
*   **`storage/`**: PGLite/Drizzle database client, schema, and repository layer.
*   **`user/`**: Dashboard and user profile management.

Shared, generic UI components are located in **`src/components/ui/`** (layouts, navbars, sidebars, modals).

State management is decentralized into **per-feature stores** (e.g., `src/features/user/store/userStore.ts`). 

Routing is file-based using TanStack Router, located in **`src/routes/`**. The `src/routeTree.gen.ts` file is automatically generated.

## Data Privacy & Storage

This application is designed to be **local-first** and privacy-preserving:
*   **No Server Database:** All user data, including uploaded scripts, parsed content, and invoice profiles, are stored locally on your device.
*   **Local Persistence Map:**

| Data | Mechanism | Path |
|------|-----------|------|
| Scripts, folders, contents, drafts, booth sessions | PGLite (IndexedDB `idb://invoice-editor-db`) | `src/features/storage/` |
| User session / profile | Zustand `persist` → `localStorage` | `src/features/user/store/userStore.ts` |
| Invoice workspace | Zustand `persist` → `localStorage` | `src/features/invoice/store/invoiceStore.ts` |
| Invoice presets | Zustand `persist` → `localStorage` | `src/features/invoice/store/invoicePresetsStore.ts` |
| Booth settings | Zustand `persist` → `localStorage` | `src/features/booth/store/useBoothSettingsStore.ts` |

*   **Retention:** Data persists as long as your browser keeps the local storage/IndexedDB data. You can manually clear this data through your browser settings or by using the app's reset options.
*   **Note:** Because data stays local, clearing browser data or using incognito mode means your data will not be saved across sessions. Please export any important invoices or scripts manually.

## Building and Running

### Prerequisites
*   Node.js (latest LTS recommended)
*   **pnpm** (standardized package manager)

### Environment Setup
Create a `.env.local` file in the root directory based on `.env.example`.
```bash
cp .env.example .env.local
```
Key variables:
*   `CLIENT_PORT`: Required for the development server.
*   `VITE_DEMO_MODE=true`: Enables local login/register bypass (matches CI).

### Commands
*   **Install dependencies:** `pnpm install`
*   **Start development server:** `pnpm run dev`
*   **Build for production:** `pnpm run build`
*   **Preview production build:** `pnpm run preview`
*   **Analyze bundle size:** `pnpm run analyze`
*   **Run tests:** `pnpm run test`
*   **Type check:** `pnpm run typecheck`
*   **Linting & Formatting:**
    *   `pnpm run lint`: Run Biome linter.
    *   `pnpm run format`: Run Biome formatter.
    *   `pnpm run check`: Run both linting and formatting checks.
*   **Setup:** `pnpm run prepare` (installs husky hooks)

### Running with Docker

This project can be containerized using Docker for easy deployment and sharing.

**Prerequisites:**
*   Docker and Docker Compose installed on your machine.

**Commands:**
1.  **Build and start the container:**
    ```bash
    docker compose up --build -d
    ```
2.  **Access the application:**
    Open your browser and navigate to `http://localhost:8080`.
3.  **Stop the container:**
    ```bash
    docker compose down
    ```

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

## License

This project is released under a **Source-Available Non-Commercial License**. 

*   **Permitted:** Personal review, evaluation by potential employers, and local non-commercial use on a private network.
*   **Prohibited:** Commercial use, redistribution, public hosting for third parties, or selling of the software.

Please see the [LICENSE](LICENSE) file for the full legal terms.