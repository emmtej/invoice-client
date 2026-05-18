import { AppShell, Box, Burger, Container, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMatches } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { AppFooter } from "./AppFooter";
import {
	APP_CONTENT_MAX_WIDTH,
	APP_SHELL_HEADER_HEIGHT,
	APP_SHELL_MOBILE_BREAKPOINT,
	APP_SHELL_NAVBAR_WIDTH,
} from "./layout-constants";

interface LayoutProps {
	children: ReactNode;
}

function useLayoutConfig() {
	const matches = useMatches();
	const config = matches
		.slice()
		.reverse()
		.find(
			(match) =>
				match.staticData?.layoutMode !== undefined ||
				match.staticData?.hideSidebar !== undefined,
		)?.staticData;

	return {
		isFlush: config?.layoutMode === "flush",
		hideSidebar: config?.hideSidebar ?? false,
	};
}

export function AppLayout({ children }: LayoutProps) {
	const [opened, { toggle, close }] = useDisclosure();
	const { isFlush, hideSidebar } = useLayoutConfig();

	const navbarConfig = hideSidebar
		? undefined
		: {
				width: APP_SHELL_NAVBAR_WIDTH,
				breakpoint: APP_SHELL_MOBILE_BREAKPOINT,
				collapsed: { mobile: !opened },
			};

	const headerContent = (
		<Group h="100%" px="md" gap="sm" wrap="nowrap">
			{!hideSidebar && (
				<Burger
					opened={opened}
					onClick={toggle}
					hiddenFrom={APP_SHELL_MOBILE_BREAKPOINT}
					size="md"
					aria-label={opened ? "Close navigation" : "Open navigation"}
				/>
			)}
			<Navbar />
		</Group>
	);

	const mainContent = isFlush ? (
		children
	) : (
		<Container maw={APP_CONTENT_MAX_WIDTH} w="100%" py="xl" px="md">
			{children}
		</Container>
	);

	return (
		<AppShell
			zIndex={100}
			header={{ height: APP_SHELL_HEADER_HEIGHT }}
			navbar={navbarConfig}
			padding={isFlush ? 0 : "md"}
		>
			<AppShell.Header>{headerContent}</AppShell.Header>

			{!hideSidebar && (
				<AppShell.Navbar p={0}>
					<Sidebar onNavigate={close} />
				</AppShell.Navbar>
			)}

			<AppShell.Main className="flex flex-col min-h-dvh">
				<Box component="section" flex={1} w="100%">
					{mainContent}
				</Box>

				<Box component="footer" py="xl" className="border-t bg-gray-0/30">
					<Container maw={APP_CONTENT_MAX_WIDTH} w="100%" px="md">
						<AppFooter />
					</Container>
				</Box>
			</AppShell.Main>
		</AppShell>
	);
}
