"use client";

import { Box } from "@mantine/core";
import type { ReactNode } from "react";
import { APP_CONTENT_INSET_X } from "@/components/ui/layout/layout-constants";

interface HomeSectionProps {
	children: ReactNode;
	/** Full-bleed shell only: background, borders, overflow, min-height. */
	className?: string;
	/** Content column: vertical rhythm, alignment. Horizontal inset is always applied. */
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
		APP_CONTENT_INSET_X,
		align === "center" ? "text-center" : "",
		containerClassName ?? "",
	]
		.filter(Boolean)
		.join(" ");

	return (
		<Box component="section" className={className}>
			<div className={containerClasses}>{children}</div>
		</Box>
	);
}
