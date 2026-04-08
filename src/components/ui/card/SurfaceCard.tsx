import { Paper, type MantineTheme, type PaperProps } from "@mantine/core";
import type { CSSProperties, ReactNode } from "react";

const surfaceStyle = {
	border: "1px solid #F3F4F6", // very faint border
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
		<Paper p="xl" bg="white" shadow="sm" style={mergedStyle} {...rest}>
			{children}
		</Paper>
	);
}
