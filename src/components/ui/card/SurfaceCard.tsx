import { Paper, type PaperProps } from "@mantine/core";
import type { ReactNode } from "react";

interface SurfaceCardProps extends PaperProps {
	children: ReactNode;
}

export function SurfaceCard({ children, ...rest }: SurfaceCardProps) {
	return (
		<Paper p="xl" {...rest}>
			{children}
		</Paper>
	);
}
