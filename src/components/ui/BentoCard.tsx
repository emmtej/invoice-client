import { Box, type BoxProps } from "@mantine/core";
import type { ReactNode } from "react";

interface BentoCardProps extends BoxProps {
	children: ReactNode;
}

export function BentoCard({ children, className, ...others }: BentoCardProps) {
	return (
		<Box
			className={`bg-white rounded-none border p-8 flex flex-col relative overflow-hidden ${className || ""}`}
			{...others}
		>
			{children}
		</Box>
	);
}
