import { AppShell, Box, Burger, Container, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useMatches } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { Navbar } from "../navbar/Navbar";
import { Sidebar } from "../sidebar/Sidebar";
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

function useIsFlushLayout() {
	const matches = useMatches();
	return (
		matches
			.slice()
			.reverse()
			.find((match) => match.staticData?.layoutMode !== undefined)?.staticData
			?.layoutMode === "flush"
	);
}

function useIsSidebarHidden() {
	const matches = useMatches();
	return (
		matches
			.slice()
			.reverse()
			.find((match) => match.staticData?.hideSidebar !== undefined)?.staticData
			?.hideSidebar ?? false
	);
}

export function Layout({ children }: LayoutProps) {
	const [opened, { toggle, close }] = useDisclosure();
	const isFlushLayout = useIsFlushLayout();
	const isSidebarHidden = useIsSidebarHidden();

	return (
		<AppShell
			padding={0}
			zIndex={100}
			header={{
				height: APP_SHELL_HEADER_HEIGHT,
			}}
			navbar={
				isSidebarHidden
					? undefined
					: {
							width: {
								base: "75%",
								[APP_SHELL_MOBILE_BREAKPOINT]: APP_SHELL_NAVBAR_WIDTH,
							},
							breakpoint: APP_SHELL_MOBILE_BREAKPOINT,
							collapsed: { mobile: !opened },
						}
			}
		>
			<AppShell.Header>
				<Group h="100%" px="md" gap="sm" wrap="nowrap">
					{!isSidebarHidden && (
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
			</AppShell.Header>
			{!isSidebarHidden && (
				<AppShell.Navbar p={0}>
					<Sidebar onNavigate={close} />
				</AppShell.Navbar>
			)}

			<AppShell.Main className="flex flex-col min-h-dvh">
				{isFlushLayout ? (
					<Box flex={1} w="100%">
						{children}
					</Box>
				) : (
					<Container
						maw={APP_CONTENT_MAX_WIDTH}
						w="100%"
						py="xl"
						px="md"
						flex={1}
					>
						{children}
					</Container>
				)}
				<Box component="footer" py="xl" className="border-t">
					<Container maw={APP_CONTENT_MAX_WIDTH} w="100%" px="md">
						<AppFooter />
					</Container>
				</Box>
			</AppShell.Main>
		</AppShell>
	);
}
