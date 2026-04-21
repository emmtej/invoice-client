import { type MantineTheme, Paper, type PaperProps } from "@mantine/core";
import type { CSSProperties, ReactNode } from "react";

const surfaceStyle = {
	transition: "transform 150ms ease, box-shadow 150ms ease",
};

interface SurfaceCardProps extends PaperProps {
	children: ReactNode;
}

function isStyleFunction(
	style: PaperProps["style"],
): style is (theme: MantineTheme) => CSSProperties {
	return typeof style === "function";
}

export function SurfaceCard({ children, style, ...rest }: SurfaceCardProps) {
	const mergedStyle = isStyleFunction(style)
		? (theme: MantineTheme) => ({
				...surfaceStyle,
				...style(theme),
			})
		: { ...surfaceStyle, ...(style ?? {}) };

	return (
		<Paper p="xl" style={mergedStyle} {...rest}>
			{children}
		</Paper>
	);
}
