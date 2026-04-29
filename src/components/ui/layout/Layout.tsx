import {
	AppShell,
	Box,
	Burger,
	Container,
	Group,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type ReactNode } from "react";
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

export function Layout({ children }: LayoutProps) {
	const [opened, { toggle, close }] = useDisclosure();

	return (
		<AppShell
			padding={0}
			zIndex={100}
			header={{
				height: APP_SHELL_HEADER_HEIGHT,
			}}
			navbar={{
				width: {
					base: "75%",
					[APP_SHELL_MOBILE_BREAKPOINT]: APP_SHELL_NAVBAR_WIDTH,
				},
				breakpoint: APP_SHELL_MOBILE_BREAKPOINT,
				collapsed: { mobile: !opened },
			}}
			styles={{
				main: {
					backgroundColor: "var(--app-bg)",
				},
			}}
		>
			{/* Paper Grain Overlay */}
			<Box
				style={{
					position: "fixed",
					top: 0,
					left: 0,
					width: "100%",
					height: "100%",
					pointerEvents: "none",
					zIndex: 9999,
					opacity: 0.015,
					backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
				}}
			/>

			<AppShell.Header>
				<Group h="100%" px="md" gap="sm" wrap="nowrap">
					<Burger
						opened={opened}
						onClick={toggle}
						hiddenFrom={APP_SHELL_MOBILE_BREAKPOINT}
						size="sm"
					/>
					<Navbar />
				</Group>
			</AppShell.Header>
			<AppShell.Navbar p={0}>
				<Sidebar onNavigate={close} />
			</AppShell.Navbar>

			<AppShell.Main
				display="flex"
				style={{ flexDirection: "column", minHeight: "100dvh" }}
			>
				<Container
					maw={APP_CONTENT_MAX_WIDTH}
					w="100%"
					py="xl"
					px="md"
					flex={1}
				>
					{children}
				</Container>
				<Box
					component="footer"
					py="xl"
					bg="var(--app-bg)"
					style={{ borderTop: "1px solid var(--mantine-color-sage-2)" }}
				>
					<Container maw={APP_CONTENT_MAX_WIDTH} w="100%" px="md">
						<AppFooter />
					</Container>
				</Box>
			</AppShell.Main>
		</AppShell>
	);
}
