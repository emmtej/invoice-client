import { Box, ScrollArea } from "@mantine/core";
import type { LucideIcon } from "lucide-react";
import { useMemo } from "react";
import { MENU } from "@/config/menu";
import { useUserStore } from "@/features/user/userStore";
import { LinksGroup } from "./NavLinksGroup";
import { UserButton } from "./UserButton";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
	const user = useUserStore((store) => store.user);

	const links = useMemo(() => 
		MENU.filter(
			(item): item is typeof item & { icon: LucideIcon } => item.icon != null,
		).map((item) => (
			<LinksGroup
				key={item.path || item.label}
				label={item.label}
				icon={item.icon}
				href={item.path}
				initiallyOpened={item.initiallyOpened ?? false}
				links={item.children?.map((child) => ({
					label: child.label,
					link: child.path,
				}))}
				onNavigate={onNavigate}
			/>
		)),
		[onNavigate]
	);

	return (
		<Box bg="white" h="100%" w="100%" px="xl" py="md" className="flex flex-col border-r">
			<ScrollArea flex={1} className="py-4">
				{links}
			</ScrollArea>

			{user && (
				<Box pt="md" className="border-t">
					<UserButton user={user} />
				</Box>
			)}
		</Box>
	);
}
