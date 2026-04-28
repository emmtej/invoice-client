import {
	AppShell,
	Box,
	Burger,
	Container,
	Group,
	Overlay,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { type ReactNode, useEffect } from "react";
import { useInvoicePresetsStore } from "@/features/invoice/store/invoicePresetsStore";
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
	const migrate = useInvoicePresetsStore((s) => s._migrateFromOldStorage);

	useEffect(() => {
		migrate();
	}, [migrate]);

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
		>
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

			{opened && (
				<Overlay
					onClick={toggle}
					zIndex={200}
					backgroundOpacity={0.5}
					blur={2}
					fixed
					hiddenFrom={APP_SHELL_MOBILE_BREAKPOINT}
				/>
			)}

			<AppShell.Main
				display="flex"
				style={{ flexDirection: "column", minHeight: "100dvh" }}
			>
				<Container
					maw={APP_CONTENT_MAX_WIDTH}
					size="lg"
					py="xl"
					px="md"
					flex={1}
					w="100%"
					display="flex"
					style={{
						flexDirection: "column",
					}}
				>
					{children}
				</Container>
				<Box
					component="footer"
					py="xl"
					bg="white"
					style={{ borderTop: "1px solid var(--mantine-color-gray-2)" }}
				>
					<Container maw={APP_CONTENT_MAX_WIDTH} size="lg" px="md">
						<AppFooter />
					</Container>
				</Box>
			</AppShell.Main>
		</AppShell>
	);
}
