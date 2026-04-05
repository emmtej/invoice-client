import { AppShell, Burger, Container, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import type { ReactNode } from "react";
import { Navbar } from "../navbar/Navbar";
import { Sidebar } from "../sidebar/Sidebar";
import {
	APP_SHELL_HEADER_HEIGHT,
	APP_SHELL_NAVBAR_WIDTH,
} from "./layout-constants";

const mobileBreakpoint = "xl";

interface LayoutProps {
	children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
	const [opened, { toggle }] = useDisclosure();
	return (
		<AppShell
			padding="md"
			header={{
				height: APP_SHELL_HEADER_HEIGHT,
			}}
			navbar={{
				width: APP_SHELL_NAVBAR_WIDTH,
				breakpoint: mobileBreakpoint,
				collapsed: { mobile: !opened },
			}}
		>
			<AppShell.Header>
				<Group h="100%" px="md" gap="sm" wrap="nowrap">
					<Burger
						opened={opened}
						onClick={toggle}
						hiddenFrom={mobileBreakpoint}
						size="sm"
					/>
					<Navbar />
				</Group>
			</AppShell.Header>
			<AppShell.Navbar p={0}>
				<Sidebar />
			</AppShell.Navbar>
			<AppShell.Main display="flex" style={{ flexDirection: "column" }}>
				<Container
					maw={1200}
					size="lg"
					py="xs"
					px="xs"
					flex={1}
					w="100%"
					style={{ display: "flex", flexDirection: "column", minHeight: 0 }}
				>
					{children}
				</Container>
			</AppShell.Main>
		</AppShell>
	);
}
