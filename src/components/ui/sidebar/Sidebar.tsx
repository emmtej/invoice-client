import { Box, ScrollArea } from "@mantine/core";
import { MENU } from "@/config/menu";
import { useUserStore } from "@/store/userStore";
import { LinksGroup } from "./NavLinksGroup";
import { UserButton } from "./UserButton";

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
	const user = useUserStore((store) => store.user);

	const links = MENU.map((item) => {
		if (!item.icon) {
			return null;
		}

		return (
			<LinksGroup
				key={item.label}
				label={item.label}
				icon={item.icon}
				href={item.path}
				initiallyOpened={item.initiallyOpened}
				links={item.children?.map((child) => ({
					label: child.label,
					link: child.path,
				}))}
				onNavigate={onNavigate}
			/>
		);
	});

	return (
		<Box
			bg="white"
			h="100%"
			w="100%"
			px="xl"
			py="md"
			display="flex"
			style={{
				flexDirection: "column",
			}}
		>
			<ScrollArea flex={1}>
				<div>{links}</div>
			</ScrollArea>

			{user && (
				<Box
					pt="md"
					mt="md"
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
