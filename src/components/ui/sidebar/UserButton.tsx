import { Avatar, Box, Group, Text, UnstyledButton } from "@mantine/core";
import { ChevronRight } from "lucide-react";
import type { UserProfile } from "@/store/userStore";

interface UserButtonProps {
	user: UserProfile;
}

export function UserButton({ user }: UserButtonProps) {
	return (
		<UnstyledButton
			w="100%"
			p="md"
			display="block"
			style={{
				color: "var(--mantine-color-black)",
				"&:hover": {
					backgroundColor: "var(--mantine-color-primary-0)",
				},
			}}
		>
			<Group>
				<Avatar src={user.profileImgUrl} radius="xl" />
				<Box flex={1}>
					<Text size="sm" fw={500}>
						{user.firstname} {user.lastname}
					</Text>
					<Text c="dimmed" size="xs">
						{user.email}
					</Text>
				</Box>
				<ChevronRight size={14} strokeWidth={1.5} />
			</Group>
		</UnstyledButton>
	);
}
