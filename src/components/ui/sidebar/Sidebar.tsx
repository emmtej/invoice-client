import { Box, ScrollArea } from "@mantine/core";
import {
	FileText,
	FolderOpen,
	Mic,
	Receipt,
	User,
	Wrench,
} from "lucide-react";
import { useUserStore } from "@/store/userStore";
import { LinksGroup } from "./NavLinksGroup";
import { UserButton } from "./UserButton";

const navlinks = [
	{ label: "Booth", icon: Mic, href: "/booth" },

	{
		label: "Invoices",
		icon: Receipt,
		initiallyOpened: true,
		links: [
			{ label: "New Invoice", link: "/invoice" },
			{ label: "Presets", link: "/invoice/presets" },
		],
	},
	{
		label: "Tools",
		icon: Wrench,
		links: [
			{ label: "Scripts", link: "/scripts" },
			{ label: "Editor", link: "/editor" },
		],
	},
	{ label: "Profile", icon: User, href: "/profile" },
];

interface SidebarProps {
	onNavigate?: () => void;
}

export function Sidebar({ onNavigate }: SidebarProps) {
	const user = useUserStore((store) => store.user);

	const links = navlinks.map((item) => (
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
