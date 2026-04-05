import { Text, type TextProps } from "@mantine/core";
import type { ReactNode } from "react";

interface SectionLabelProps extends Omit<TextProps, "children"> {
	children: ReactNode;
	letterSpacing?: number;
}

export function SectionLabel({
	children,
	letterSpacing = 1,
	...rest
}: SectionLabelProps) {
	return (
		<Text
			size="xs"
			fw={800}
			c="dimmed"
			tt="uppercase"
			lts={letterSpacing}
			{...rest}
		>
			{children}
		</Text>
	);
}
