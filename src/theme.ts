import { createTheme } from "@mantine/core";

const fontSans =
	'"Geist Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const fontDisplay = '"Playfair Display", serif';

export const appTheme = createTheme({
	fontFamily: fontSans,
	defaultRadius: 0,
	headings: {
		fontFamily: fontDisplay,
	},
});
