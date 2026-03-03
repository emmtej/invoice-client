import { createTheme } from "@mantine/core";

/**
 * Notion-inspired design tokens:
 * - Spacing: section padding = md/lg, form fields = sm/md, inline gaps = xs/sm
 * - Accent: primary = violet for CTAs and active nav; danger = red for errors
 * - Surfaces: body default, cards gray.0 / dark.6, borders gray.3 / dark.4
 */
export const appTheme = createTheme({
	primaryColor: "violet",
	defaultRadius: "sm",
	fontFamily:
		"Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
	headings: {
		fontFamily:
			"Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
	},
});
