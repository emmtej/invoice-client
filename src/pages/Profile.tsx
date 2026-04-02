import {
	Button,
	Group,
	Paper,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { IconMicrophone2, IconUser } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

export default function Profile() {
	return (
		<Stack gap="lg">
			<div>
				<Title order={2}>Profile</Title>
				<Text c="dimmed" size="sm" mt={4}>
					Account settings and defaults will live here. For now, open the editor
					or invoices to keep working.
				</Text>
			</div>

			<Paper
				withBorder
				p="xl"
				radius="md"
				maw={480}
				bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-7))"
			>
				<Stack gap="md">
					<Group gap="md">
						<ThemeIcon size={48} radius="md" variant="light" color="wave">
							<IconUser size={28} stroke={1.5} />
						</ThemeIcon>
						<div>
							<Text fw={600}>Voice workflow</Text>
							<Text size="sm" c="dimmed">
								Parse scripts and build invoices from the same workspace.
							</Text>
						</div>
					</Group>
					<Button
						component={Link}
						to="/editor"
						variant="light"
						color="wave"
						leftSection={<IconMicrophone2 size={18} />}
					>
						Open script editor
					</Button>
				</Stack>
			</Paper>
		</Stack>
	);
}
