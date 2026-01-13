import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export function Layout() {
	const [opened, { toggle }] = useDisclosure();

	return (
		<AppShell
			padding="md"
			header={{ height: 60 }}
			navbar={{
				width: 300,
				breakpoint: "sm",
				collapsed: { mobile: !opened },
			}}
		>
			<AppShell.Header>
				<Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
				<div>Logo</div>
			</AppShell.Header>
			<AppShell.Navbar>Navbar</AppShell.Navbar>{" "}
			<AppShell.Main>
				<Outlet />
			</AppShell.Main>
			<TanStackRouterDevtools />
		</AppShell>
	);
}
