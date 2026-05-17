import { Text, type TextProps } from "@mantine/core";
import type { ReactNode } from "react";

interface SectionLabelProps extends Omit<TextProps, "children"> {
	children: ReactNode;
	letterSpacing?: string | number;
}

export function SectionLabel({ children, letterSpacing, ...rest }: SectionLabelProps) {
	return (
		<Text size="sm" fw={600} lts={letterSpacing} {...rest}>
			{children}
		</Text>
	);
}
