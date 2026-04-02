import { createTheme, type MantineColorsTuple } from "@mantine/core";

/**
 * Voice-studio design tokens (soft Notion-like + Resolve/waveform accents):
 * - studio: warm terracotta primary (CTAs, active nav, key figures)
 * - wave: muted teal secondary (audio / studio moments, links, add actions)
 */
const studio: MantineColorsTuple = [
	"#fdf6f3",
	"#fceee8",
	"#f8dcd0",
	"#f0c0a8",
	"#e49a78",
	"#d47852",
	"#c45d3e",
	"#a34a32",
	"#863d2a",
	"#6f3424",
];

const wave: MantineColorsTuple = [
	"#f0faf9",
	"#d8f4f0",
	"#b3e8e0",
	"#7dd4c8",
	"#4dbdaa",
	"#2fa896",
	"#238b7c",
	"#1d7065",
	"#185a52",
	"#134a44",
];

export const appTheme = createTheme({
	primaryColor: "studio",
	colors: {
		studio,
		wave,
	},
	defaultRadius: "md",
	fontFamily:
		"Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
	headings: {
		fontFamily:
			"Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
	},
	components: {
		Paper: {
			defaultProps: {
				radius: "md",
			},
		},
		Button: {
			defaultProps: {
				radius: "md",
			},
		},
	},
});
