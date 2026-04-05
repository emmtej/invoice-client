import { Paper, type PaperProps } from "@mantine/core";
import type { ReactNode } from "react";

const surfaceStyle = {
	border: "1px solid #F3F4F6", // very faint border
	transition: "transform 150ms ease, box-shadow 150ms ease",
};

interface SurfaceCardProps extends PaperProps {
	children: ReactNode;
}

export function SurfaceCard({ children, style, ...rest }: SurfaceCardProps) {
	const mergedStyle =
		typeof style === "object" ? { ...surfaceStyle, ...style } : surfaceStyle;

	return (
		<Paper
			p="xl"
			bg="white"
			shadow="sm"
			radius="xl"
			style={mergedStyle}
			{...rest}
		>
			{children}
		</Paper>
	);
}
