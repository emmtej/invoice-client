import { useUserStore } from "@/store/userStore";
import { Box, ScrollArea } from "@mantine/core";
import { NAVIGATION, type NavItem } from "@/config/navigation";
import { LinksGroup } from "./NavLinksGroup";
import { UserButton } from "./UserButton";
import type { LucideIcon } from "lucide-react";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
	const user = useUserStore((store) => store.user);

	// Combine public and protected for sidebar display
	const allNavItems = [...NAVIGATION.public, ...NAVIGATION.protected];

	// Type guard to ensure icon exists for sidebar items
	const sidebarLinks = allNavItems
		.filter(
			(item): item is NavItem & { icon: LucideIcon } =>
				!item.hideInSidebar && !!item.icon,
		)
		.map((item) => ({
			label: item.label,
			icon: item.icon,
			href: item.path,
			initiallyOpened: item.initiallyOpened,
			links: item.children?.map((child) => ({
				label: child.label,
				link: child.path,
			})),
		}));

	const links = sidebarLinks.map((item) => (
		<LinksGroup {...item} key={item.label} onNavigate={onNavigate} />
	));

	return (
		<Box
			bg="white"
			h="100%"
			w="100%"
			p="md"
			display="flex"
			style={{
				flexDirection: "column",
			}}
		>
			<ScrollArea flex={1} mx={`calc(var(--mantine-spacing-md) * -1)`}>
				<div>{links}</div>
			</ScrollArea>

			{user && (
				<Box
					mx={`calc(var(--mantine-spacing-md) * -1)`}
					p="md"
					style={{
						borderTop: "1px solid var(--mantine-color-gray-3)",
					}}
				>
					<UserButton user={user} />
				</Box>
			)}
		</Box>
	);
}
