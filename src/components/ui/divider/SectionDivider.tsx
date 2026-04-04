import { Divider, type DividerProps, Group } from "@mantine/core";
import type { ReactNode } from "react";
import { SectionLabel } from "../text/SectionLabel";

interface SectionDividerProps extends Omit<DividerProps, "label"> {
	icon: ReactNode;
	children: ReactNode;
}

export function SectionDivider({
	icon,
	children,
	...rest
}: SectionDividerProps) {
	return (
		<Divider
			label={
				<Group gap="xs">
					{icon}
					<SectionLabel>{children}</SectionLabel>
				</Group>
			}
			labelPosition="left"
			{...rest}
		/>
	);
}
