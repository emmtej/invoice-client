import { createTheme, type MantineColorsTuple } from "@mantine/core";

/**
 * InVoice design tokens (warm, Gusto-inspired financial aesthetic):
 * - wave: deep teal primary (CTAs, active nav, links, focus rings)
 * - studio: warm terracotta accent (badges, illustrations, warm tints)
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
	primaryColor: "wave",
	primaryShade: 8,
	colors: {
		studio,
		wave,
	},
	black: "#1F2937",
	defaultRadius: "xl",
	shadows: {
		sm: "0 2px 10px -3px rgba(0, 0, 0, 0.05)",
		md: "0 4px 15px -5px rgba(0, 0, 0, 0.05)",
		lg: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
	},
	fontFamily:
		"Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
	headings: {
		fontFamily:
			"Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif",
		fontWeight: "800",
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
		Input: {
			defaultProps: {
				radius: "lg",
			},
		},
		InputWrapper: {
			styles: {
				label: {
					fontSize: "12px",
					textTransform: "uppercase",
					letterSpacing: "0.05em",
					fontWeight: 600,
					color: "#6B7280",
					marginBottom: "4px",
				},
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
			styles: {
				thead: {
					backgroundColor: "transparent",
				},
				th: {
					borderBottom: "1px solid #F3F4F6",
					color: "#6B7280",
					fontSize: "12px",
					textTransform: "uppercase",
					letterSpacing: "0.05em",
					fontWeight: 600,
				},
				tr: {
					transition: "background-color 150ms ease",
				},
				td: {
					borderBottom: "1px solid #F3F4F6",
				},
			},
		},
	},
});
