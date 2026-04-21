import { createTheme, type MantineColorsTuple } from "@mantine/core";

// Custom local fonts
const fontSans =
	'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const fontDisplay = '"Sneaky Times", serif';

const wave: MantineColorsTuple = [
	"#e6fcf5", // 0: Background/Ghost
	"#c3fae8", // 1: Hover/Lightest
	"#96f2d7", // 2: Light
	"#63e6be", // 3: Soft
	"#38d9a9", // 4: Muted
	"#20c997", // 5: Base Muted
	"#12b886", // 6: Solid
	"#0ca678", // 7: Dark Solid
	"#099268", // 8: Primary Base
	"#087f5b", // 9: Deepest
];

const studio: MantineColorsTuple = [
	"#fff0e6", // 0: Background/Ghost
	"#ffe8cc", // 1: Hover/Lightest
	"#ffd8a8", // 2: Light
	"#ffc078", // 3: Soft
	"#ffa94d", // 4: Muted
	"#ff922b", // 5: Base Muted
	"#fd7e14", // 6: Solid
	"#f76707", // 7: Dark Solid
	"#e8590c", // 8: Primary Base
	"#d9480f", // 9: Deepest
];

export const appTheme = createTheme({
	primaryColor: "wave",
	primaryShade: 8,
	colors: {
		studio,
		wave,
	},
	black: "#2b3440", // Softer dark grey
	defaultRadius: "0",
	radius: {
		xs: "0px",
		sm: "0px",
		md: "0px",
		lg: "0px",
		xl: "0px",
	},
	shadows: {
		sm: "0 4px 12px -2px rgba(0, 0, 0, 0.04), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
		md: "0 10px 15px -3px rgba(0, 0, 0, 0.04), 0 4px 6px -2px rgba(0, 0, 0, 0.02)",
		lg: "0 20px 25px -5px rgba(0, 0, 0, 0.04), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
	},
	fontFamily: fontSans,
	headings: {
		fontFamily: fontDisplay,
		fontWeight: "700",
		sizes: {
			h1: { fontSize: "40px", lineHeight: "1.2" },
			h2: { fontSize: "32px", lineHeight: "1.25" },
		},
	},
	components: {
		Text: {
			defaultProps: {
				className: "font-sans",
			},
		},
		TextInput: {
			defaultProps: { radius: "0" },
			styles: {
				input: {
					fontFamily: "var(--mantine-font-family)",
					"&:focus": {
						borderColor: "var(--mantine-color-wave-8)",
					},
				},
				label: {
					fontFamily: "var(--mantine-font-family)",
				},
			},
		},
		Paper: {
			defaultProps: {
				shadow: "sm",
				withBorder: true,
				radius: "0",
			},
			styles: {
				root: {
					borderColor: "var(--mantine-color-gray-2)",
				},
			},
		},
		Button: {
			defaultProps: { radius: "0" },
			styles: {
				root: {
					fontWeight: 600,
					transition: "all 150ms ease",
				},
			},
		},
		Input: {
			defaultProps: { radius: "0" },
			styles: {
				input: {
					"&:focus": {
						borderColor: "var(--mantine-color-wave-8)",
					},
				},
			},
		},
		ActionIcon: { defaultProps: { radius: "0" } },
		Badge: {
			defaultProps: { radius: "0" },
			styles: {
				root: {
					textTransform: "capitalize",
					letterSpacing: "0",
					fontWeight: 600,
				},
			},
		},
		Avatar: { defaultProps: { radius: "0" } },
		ThemeIcon: { defaultProps: { radius: "0" } },
		SegmentedControl: {
			defaultProps: { radius: "0" },
			styles: {
				root: {
					backgroundColor: "var(--mantine-color-gray-0)",
				},
				indicator: {
					boxShadow: "var(--mantine-shadow-sm)",
				},
			},
		},
		InputWrapper: {
			styles: {
				label: {
					fontSize: "13px",
					fontWeight: 600,
					color: "#4b5563",
					marginBottom: "4px",
					letterSpacing: "0",
				},
			},
		},
		Modal: {
			defaultProps: {
				centered: true,
				withinPortal: true,
				overlayProps: {
					blur: 3,
					backgroundOpacity: 0.5,
				},
				radius: "0",
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
					backgroundColor: "var(--mantine-color-gray-0)",
				},
				th: {
					borderBottom: "1px solid var(--mantine-color-gray-2)",
					color: "#4b5563",
					fontSize: "12px",
					textTransform: "uppercase",
					letterSpacing: "0.05em",
					fontWeight: 700,
				},
				td: {
					borderBottom: "1px solid var(--mantine-color-gray-1)",
				},
			},
		},
		Title: {
			styles: {
				root: {
					color: "#2b3440",
				},
			},
		},
	},
});
