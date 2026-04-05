import { createTheme, type MantineColorsTuple } from "@mantine/core";

const fontSans =
	"Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif";

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
	defaultRadius: 0,
	radius: {
		xs: "0px",
		sm: "0px",
		md: "0px",
		lg: "0px",
		xl: "0px",
	},
	shadows: {
		sm: "0 2px 10px -3px rgba(0, 0, 0, 0.05)",
		md: "0 4px 15px -5px rgba(0, 0, 0, 0.05)",
		lg: "0 10px 25px -5px rgba(0, 0, 0, 0.05)",
	},
	fontFamily: fontSans,
	headings: {
		fontFamily: fontSans,
		fontWeight: "800",
	},
	components: {
		Paper: {
			defaultProps: {
				shadow: "sm",
				withBorder: false,
			},
		},
		Button: {
			defaultProps: { radius: 0 },
		},
		Input: { defaultProps: { radius: 0 } },
		ActionIcon: { defaultProps: { radius: 0 } },
		Badge: { defaultProps: { radius: 0 } },
		Avatar: { defaultProps: { radius: 0 } },
		ThemeIcon: { defaultProps: { radius: 0 } },
		SegmentedControl: { defaultProps: { radius: 0 } },
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
		Title: {
			styles: {
				root: {
					color: "#1F2937",
				},
			},
		},
	},
});
