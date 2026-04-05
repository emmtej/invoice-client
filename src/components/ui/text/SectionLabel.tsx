import { Text, type TextProps } from "@mantine/core";
import type { ReactNode } from "react";

interface SectionLabelProps extends Omit<TextProps, "children"> {
	children: ReactNode;
	letterSpacing?: string | number;
}

export function SectionLabel({
	children,
	letterSpacing = "0.05em",
	...rest
}: SectionLabelProps) {
	return (
		<Text
			size="sm"
			fw={600}
			c="gray.5"
			tt="uppercase"
			lts={letterSpacing}
			{...rest}
		>
			{children}
		</Text>
	);
}
