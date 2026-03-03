import { Stack, Text, Title } from "@mantine/core";

export default function Dashboard() {
	return (
		<Stack gap="md">
			<Title order={2}>Dashboard</Title>
			<Text c="dimmed" size="sm">
				Welcome to your dashboard.
			</Text>
		</Stack>
	);
}
