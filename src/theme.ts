import { createTheme, type MantineColorsTuple } from "@mantine/core";

// Custom local fonts
const fontSans =
	'Poppins, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const fontDisplay = '"Sneaky Times", serif';

const studioBlue: MantineColorsTuple = [
	"#e7e9ed",
	"#cfd4db",
	"#a0a9b7",
	"#707e93",
	"#415370",
	"#11284d",
	"#092648", // 6: Primary Base
	"#082241",
	"#071e3a",
	"#061a32",
];

const onAirRed: MantineColorsTuple = [
	"#f9e9eb",
	"#f3d3d8",
	"#e7a7b1",
	"#db7b8a",
	"#cf4f63",
	"#c4233d",
	"#c41e3a", // 6: Secondary Base
	"#b01b34",
	"#9d182e",
	"#891528",
];

export const appTheme = createTheme({
	primaryColor: "studio-blue",
	primaryShade: 6,
	colors: {
		"studio-blue": studioBlue,
		"on-air-red": onAirRed,
	},
	black: "#212529", // Charcoal
	white: "#FFFFFF",
	defaultRadius: "md",
	radius: {
		xs: "1px",
		sm: "2px",
		md: "4px",
		lg: "8px",
		xl: "12px",
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
			defaultProps: {},
		},
		TextInput: {
			styles: {
				input: {
					fontFamily: "var(--mantine-font-family)",
					"&:focus": {
						borderColor: "var(--mantine-color-studio-blue-6)",
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
				bg: "#EBE4D5", // Aged Paper
			},
			styles: {
				root: {
					borderColor: "rgba(0,0,0,0.05)",
					overflow: "hidden",
				},
			},
		},
		Card: {
			defaultProps: {
				bg: "#EBE4D5", // Aged Paper
			},
		},
		Button: {
			defaultProps: {
				color: "studio-blue",
			},
			styles: {
				root: {
					fontWeight: 600,
					transition: "all 150ms ease",
				},
			},
		},
		Input: {
			styles: {
				input: {
					"&:focus": {
						borderColor: "var(--mantine-color-studio-blue-6)",
					},
				},
			},
		},
		ActionIcon: { defaultProps: {} },
		Badge: {
			styles: {
				root: {
					textTransform: "capitalize",
					letterSpacing: "0",
					fontWeight: 600,
				},
			},
		},
		Avatar: { defaultProps: {} },
		ThemeIcon: { defaultProps: {} },
		SegmentedControl: {
			styles: {
				root: {
					backgroundColor: "rgba(0,0,0,0.05)",
				},
				indicator: {
					boxShadow: "var(--mantine-shadow-sm)",
				},
			},
		},
		InputWrapper: {
			styles: {
				label: {
					fontSize: "var(--mantine-font-size-sm)",
					fontWeight: 600,
					color: "var(--mantine-color-black)",
					marginBottom: "var(--mantine-spacing-xs)",
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
					backgroundColor: "rgba(0,0,0,0.02)",
				},
				th: {
					borderBottom: "1px solid rgba(0,0,0,0.05)",
					color: "var(--mantine-color-black)",
					fontSize: "12px",
					textTransform: "uppercase",
					letterSpacing: "0.05em",
					fontWeight: 700,
				},
				td: {
					borderBottom: "1px solid rgba(0,0,0,0.03)",
				},
			},
		},
		Title: {
			styles: {
				root: {
					color: "var(--mantine-color-black)",
				},
			},
		},
	},
});
