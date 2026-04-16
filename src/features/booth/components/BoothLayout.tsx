import { Flex } from "@mantine/core";
import type { ReactNode } from "react";

interface BoothLayoutProps {
	children: ReactNode;
}

export function BoothLayout({ children }: BoothLayoutProps) {
	return (
		<Flex direction="column" h="100%" mih={0}>
			{children}
		</Flex>
	);
}
