import { Avatar, Box, Group, Text, UnstyledButton } from "@mantine/core";
import { ChevronRight } from "lucide-react";
import type { UserProfile } from "@/features/user/store/userStore";

interface UserButtonProps {
	user: UserProfile;
}

export function UserButton({ user }: UserButtonProps) {
	return (
		<UnstyledButton
			w="100%"
			p="md"
			display="block"
			className="transition-all hover:bg-brand-dark-50/50 rounded-2xl active:scale-[0.98] group"
			style={{
				color: "var(--mantine-color-black)",
			}}
		>
			<Group wrap="nowrap">
				<Avatar
					src={user.profileImgUrl}
					color="wave"
					radius="xl"
					className="ring-2 ring-white shadow-sm transition-transform group-hover:scale-105"
				/>
				<Box flex={1} style={{ overflow: "hidden" }}>
					<Text size="sm" fw={600} c="brand-dark.7" className="truncate tracking-tight">
						{user.firstname} {user.lastname}
					</Text>
					<Text c="brand-dark.4" size="xs" className="truncate opacity-80">
						{user.email}
					</Text>
				</Box>
				<ChevronRight
					size={14}
					strokeWidth={2}
					className="text-brand-dark-300 transition-transform group-hover:translate-x-0.5"
				/>
			</Group>
		</UnstyledButton>
	);
}
