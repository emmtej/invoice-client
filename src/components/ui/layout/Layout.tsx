import { AppShell, Burger, Container } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { ReactNode } from "react";
import { Navbar } from "../navbar/Navbar";
import { Sidebar } from "../sidebar/Sidebar";

const mobileBreakPoint = "xl";

interface LayoutProps {
	children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
	const [opened, { toggle }] = useDisclosure();
	return (
		<AppShell
			padding="lg"
			header={{
				height: 60,
			}}
			navbar={{
				width: 240,
				breakpoint: mobileBreakPoint,
				collapsed: { mobile: !opened },
			}}
		>
			<AppShell.Header className="flex items-center gap-2">
				<Burger
					opened={opened}
					onClick={toggle}
					hiddenFrom={mobileBreakPoint}
					size="sm"
				/>
				<Navbar />
			</AppShell.Header>
			<AppShell.Navbar>
				<Sidebar />
			</AppShell.Navbar>
			<AppShell.Main>
				<Container fluid maw={1200}>
					{children}
				</Container>
			</AppShell.Main>
			<TanStackRouterDevtools />
		</AppShell>
	);
}
