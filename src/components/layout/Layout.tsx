import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { ReactNode } from "react";
import { Sidebar } from "../sidebar/Sidebar";
import { Navbar } from "../navbar/Navbar";
import { useUserStore } from "@/store/userStore";

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
			<AppShell.Main>{children}</AppShell.Main>
			<TanStackRouterDevtools />
		</AppShell>
	);
}
