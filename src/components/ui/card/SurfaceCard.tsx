import { Paper, type PaperProps } from "@mantine/core";
import type { ReactNode } from "react";

const surfaceStyle = { border: "1px solid var(--mantine-color-gray-2)" };

interface SurfaceCardProps extends PaperProps {
	children: ReactNode;
}

export function SurfaceCard({ children, style, ...rest }: SurfaceCardProps) {
	const mergedStyle =
		typeof style === "object" ? { ...surfaceStyle, ...style } : surfaceStyle;

	return (
		<Paper p="lg" bg="white" style={mergedStyle} {...rest}>
			{children}
		</Paper>
	);
}
