"use client";

import { Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";
import { EyebrowPill } from "./EyebrowPill";

interface SectionIntroProps {
	eyebrow?: string;
	title: ReactNode;
	description: string;
	align?: "left" | "center";
	maxWidthClassName?: string;
}

export function SectionIntro({
	eyebrow,
	title,
	description,
	align = "left",
	maxWidthClassName = "max-w-2xl",
}: SectionIntroProps) {
	return (
		<Stack
			gap="xs"
			align={align === "center" ? "center" : "flex-start"}
			className={maxWidthClassName}
		>
			{eyebrow ? (
				<EyebrowPill className="mb-6">{eyebrow}</EyebrowPill>
			) : null}
			<h2 className="text-4xl font-sans font-semibold tracking-tight md:text-5xl">
				{title}
			</h2>
			<Text c="dimmed" className="max-w-[55ch] text-lg leading-relaxed">
				{description}
			</Text>
		</Stack>
	);
}
