import { Stack, Text, Title } from "@mantine/core";

export default function Profile() {
	return (
		<Stack gap="md">
			<Title order={2}>Profile</Title>
			<Text c="dimmed" size="sm">
				Manage your account settings.
			</Text>
		</Stack>
	);
}
