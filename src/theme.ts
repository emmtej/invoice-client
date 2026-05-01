import { createTheme, type MantineColorsTuple } from "@mantine/core";

// Custom local fonts
const fontSans =
	'"Source Sans 3", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const fontDisplay = '"Playfair Display", serif';

export type BrandColor =
	| "forest"
	| "sage"
	| "terracotta"
	| "wave"
	| "studio"
	| "on-air-red"
	| "brand-dark";

const forest: MantineColorsTuple = [
	"#f2f4f2",
	"#e4e8e5",
	"#c8d0cb",
	"#aab8b0",
	"#90a498",
	"#80988a",
	"#779284",
	"#657f72",
	"#597165",
	"#2d3a31", // 9: Forest Base
];

const sage: MantineColorsTuple = [
	"#f4f6f3",
	"#e9ede7",
	"#d1dbcc",
	"#b8c9b0",
	"#a3ba98",
	"#94af86",
	"#8c9a84", // 6: Sage Base
	"#7a8773",
	"#6d7866",
	"#5c6657",
];

const terracotta: MantineColorsTuple = [
	"#fdf4f2",
	"#f9e9e5",
	"#f1d2cb",
	"#e9bbaf",
	"#e2a797",
	"#db9380",
	"#d6836f",
	"#c27b66", // 7: Terracotta Base
	"#ad6e5b",
	"#986150",
];

const wave: MantineColorsTuple = [
	"#e0f7f7",
	"#b3ebeb",
	"#80dcdc",
	"#4dcdcd",
	"#26bebe",
	"#00adad", // 5: Wave Base
	"#009898",
	"#007f7f",
	"#006464",
	"#004a4a",
];

const studio: MantineColorsTuple = [
	"#f0f4ff",
	"#d6e0ff",
	"#adc1ff",
	"#82a0ff",
	"#5c83ff",
	"#3a6aff", // 5: Studio Base
	"#2557e6",
	"#1844cc",
	"#0e32a3",
	"#072080",
];

const onAirRed: MantineColorsTuple = [
	"#fff1f0",
	"#ffd9d6",
	"#ffb0a8",
	"#ff8478",
	"#ff5d4f",
	"#ff3d2e", // 5: On-Air Base — recording indicator
	"#e62a1c",
	"#bf1f13",
	"#99170d",
	"#7a1109",
];

const brandDark: MantineColorsTuple = [
	"#f4f5f4",
	"#e6e8e6",
	"#c8ccca",
	"#a4abaa", // 3
	"#7c8584", // 4: secondary body text
	"#5b6463",
	"#3f4847", // 6: primary heading text
	"#2d3534",
	"#1f2625",
	"#13191a",
];

export const appTheme = createTheme({
	primaryColor: "forest",
	primaryShade: 9,
	colors: {
		forest,
		sage,
		terracotta,
		wave,
		studio,
		"on-air-red": onAirRed,
		"brand-dark": brandDark,
	},
	black: "#2D3A31", // Forest
	white: "#FFFFFF",
	defaultRadius: "md",
	radius: {
		xs: "2px",
		sm: "4px",
		md: "8px",
		lg: "16px",
		xl: "32px",
		"3xl": "24px",
	},
	shadows: {
		sm: "0 4px 12px -2px rgba(45, 58, 49, 0.04), 0 2px 4px -1px rgba(45, 58, 49, 0.02)",
		md: "0 10px 15px -3px rgba(45, 58, 49, 0.05), 0 4px 6px -2px rgba(45, 58, 49, 0.02)",
		lg: "0 20px 25px -5px rgba(45, 58, 49, 0.05), 0 10px 10px -5px rgba(45, 58, 49, 0.02)",
	},
	fontFamily: fontSans,
	headings: {
		fontFamily: fontDisplay,
		fontWeight: "600",
		sizes: {
			h1: { fontSize: "48px", lineHeight: "1.1" },
			h2: { fontSize: "36px", lineHeight: "1.2" },
		},
	},
	components: {
		Text: {
			defaultProps: {
				c: "forest.9",
			},
		},
		TextInput: {
			defaultProps: {
				variant: "unstyled",
			},
			styles: {
				input: {
					borderBottom: "1px solid #E6E2DA",
					borderRadius: 0,
					paddingLeft: 0,
					paddingRight: 0,
					"&:focus": {
						borderBottomColor: "var(--mantine-color-forest-9)",
					},
				},
				label: {
					fontFamily: "var(--mantine-font-family)",
					fontSize: "12px",
					textTransform: "uppercase",
					letterSpacing: "0.05em",
					color: "var(--mantine-color-sage-6)",
				},
			},
		},
		Paper: {
			defaultProps: {
				radius: "3xl",
				shadow: "md",
				withBorder: false,
			},
			styles: {
				root: {
					backgroundColor: "var(--mantine-color-white)",
					overflow: "hidden",
				},
			},
		},
		Button: {
			defaultProps: {
				radius: "xl",
				variant: "filled",
			},
			styles: {
				root: {
					textTransform: "uppercase",
					letterSpacing: "0.1em",
					fontWeight: 600,
					transition: "all 0.3s ease",
				},
			},
		},
		Table: {
			styles: {
				th: {
					color: "var(--mantine-color-sage-6)",
					borderBottom: "1px solid #E6E2DA",
					fontSize: "11px",
					fontWeight: 800,
					textTransform: "uppercase",
					letterSpacing: "1px",
				},
				td: {
					borderBottom: "1px solid #F2F4F2",
				},
			},
		},
		RichTextEditor: {
			styles: {
				root: {
					border: "none",
					backgroundColor: "transparent",
				},
				content: {
					backgroundColor: "transparent",
					fontSize: "18px",
					fontFamily: "var(--mantine-font-family)",
					lineHeight: "1.6",
					color: "var(--mantine-color-forest-9)",
				},
				toolbar: {
					backgroundColor: "transparent",
					borderBottom: "none",
					padding: "0 0 var(--mantine-spacing-md) 0",
				},
				control: {
					borderRadius: "100px",
					border: "none",
					transition: "all 0.3s ease",
					backgroundColor: "transparent",
					"&:hover": {
						backgroundColor: "var(--mantine-color-terracotta-0)",
						color: "var(--mantine-color-terracotta-7)",
					},
				},
			},
		},
	},
});
