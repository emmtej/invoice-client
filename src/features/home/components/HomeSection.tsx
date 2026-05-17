"use client";

import { Box, Container } from "@mantine/core";
import type { ReactNode } from "react";
import { APP_CONTENT_MAX_WIDTH } from "@/components/ui/layout/layout-constants";

interface HomeSectionProps {
	children: ReactNode;
	className?: string;
	containerClassName?: string;
	align?: "left" | "center";
}

export function HomeSection({
	children,
	className,
	containerClassName,
	align = "left",
}: HomeSectionProps) {
	const containerClasses = [
		align === "center" ? "text-center" : "",
		containerClassName ?? "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<Box component="section" className={className}>
			<Container
				maw={APP_CONTENT_MAX_WIDTH}
				w="100%"
				px="md"
				className={containerClasses || undefined}
			>
				{children}
			</Container>
		</Box>
	);
}
