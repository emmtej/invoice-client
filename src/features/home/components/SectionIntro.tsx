"use client";

import { Stack, Text } from "@mantine/core";
import type { ReactNode } from "react";

interface SectionIntroProps {
	eyebrow?: string;
	eyebrowColor?: string;
	title: ReactNode;
	description: string;
	align?: "left" | "center";
	maxWidthClassName?: string;
}

export function SectionIntro({
	eyebrow,
	eyebrowColor = "terracotta.7",
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
				<Text
					size="xs"
					fw={700}
					tt="uppercase"
					lts="0.2em"
					c={eyebrowColor}
					className="mb-6"
				>
					{eyebrow}
				</Text>
			) : null}
			<h2
				className={`text-4xl md:text-5xl font-sans font-semibold tracking-tight text-forest ${eyebrow ? "mb-6" : ""}`}
			>
				{title}
			</h2>
			<Text className="text-lg text-brand-dark-4 leading-relaxed max-w-[55ch]">
				{description}
			</Text>
		</Stack>
	);
}
