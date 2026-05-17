import { Paper, type PaperProps } from "@mantine/core";
import type { ReactNode } from "react";

interface SurfaceCardProps extends PaperProps {
	children: ReactNode;
}

export function SurfaceCard({
	children,
	className,
	...rest
}: SurfaceCardProps) {
	return (
		<Paper
			p="xl"
			radius="3xl"
			className={`transition-all duration-150 ${className ?? ""}`}
			{...rest}
		>
			{children}
		</Paper>
	);
}
