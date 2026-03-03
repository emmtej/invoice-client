import { Avatar, Box, Group, Text, UnstyledButton } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import type { UserProfile } from "@/store/userStore";
import classes from "./UserButton.module.css";

interface UserButtonProps {
	user: UserProfile;
}

export function UserButton({ user }: UserButtonProps) {
	return (
		<UnstyledButton className={classes.user}>
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
				<IconChevronRight size={14} stroke={1.5} />
			</Group>
		</UnstyledButton>
	);
}
