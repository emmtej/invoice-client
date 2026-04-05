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
			className="transition-colors hover:bg-gray-50"
			style={{
				color: "var(--mantine-color-black)",
			}}
		>
			<Group>
				<Avatar src={user.profileImgUrl} color="wave" />
				<Box flex={1}>
					<Text size="sm" fw={600} c="gray.8">
						{user.firstname} {user.lastname}
					</Text>
					<Text c="gray.5" size="xs">
						{user.email}
					</Text>
				</Box>
				<ChevronRight size={14} strokeWidth={1.5} className="text-gray-400" />
			</Group>
		</UnstyledButton>
	);
}
