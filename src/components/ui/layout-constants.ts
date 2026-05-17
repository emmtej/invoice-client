export const APP_SHELL_HEADER_HEIGHT = 60;
export const APP_SHELL_NAVBAR_WIDTH = 290;
export const APP_SHELL_MOBILE_BREAKPOINT = "md";

/**
 * Main column cap — 1200px is a standard content width for 1440px+ viewports.
 * It provides a comfortable reading measure and aligns with common 1140–1280px shell practices.
 */
export const APP_CONTENT_MAX_WIDTH = 1400;

/** Shared horizontal inset for flush marketing pages (matches app shell `px="md"`). */
export const APP_CONTENT_INSET_X = "mx-auto w-full max-w-[1400px] px-4 md:px-6";

export type AppLayoutMode = "default" | "flush";
