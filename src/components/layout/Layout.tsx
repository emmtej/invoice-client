import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import type { ReactNode } from "react";
import { Sidebar } from "./Sidebar";

const mobileBreakPoint = "xl";

export function Layout({ children }: { children: ReactNode }) {
	const [opened, { toggle }] = useDisclosure();
	return (
		<AppShell
			padding="lg"
			header={{ height: 60 }}
			navbar={{
				width: 300,
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
				<div>Logo</div>
			</AppShell.Header>
			<AppShell.Navbar>
				<Sidebar />
			</AppShell.Navbar>
			<AppShell.Main>{children}</AppShell.Main>
			<TanStackRouterDevtools />
		</AppShell>
	);
}
