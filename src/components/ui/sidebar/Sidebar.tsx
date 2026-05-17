import { Box, ScrollArea } from "@mantine/core";
import type { LucideIcon } from "lucide-react";
import { MENU } from "@/config/menu";
import { useUserStore } from "@/features/user/store/userStore";
import { LinksGroup } from "./NavLinksGroup";
import { UserButton } from "./UserButton";
import { StaggeredList } from "../motion/StaggeredList";
import { MagneticWrapper } from "../motion/MagneticWrapper";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
	const user = useUserStore((store) => store.user);

	const links = MENU.filter(
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
	));

	return (
		<Box
			bg="white"
			h="100%"
			w="100%"
			px="xl"
			py="md"
			className="flex flex-col border-r border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.02)]"
		>
			<ScrollArea flex={1} className="py-4">
				<StaggeredList stagger={0.08}>{links}</StaggeredList>
			</ScrollArea>

			{user && (
				<Box pt="md" className="border-t border-slate-100/80">
					<MagneticWrapper strength={15}>
						<UserButton user={user} />
					</MagneticWrapper>
				</Box>
			)}
		</Box>
	);
}
