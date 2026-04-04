import {
	Box,
	Button,
	Group,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { IconMicrophone2, IconUser } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

export default function Profile() {
	return (
		<Stack gap="md">
			<div>
				<Title order={2} fw={800} size="h3">
					Profile
				</Title>
				<Text c="dimmed" size="sm" mt={4}>
					Account settings and defaults will live here. For now, open the editor
					or invoices to keep working.
				</Text>
			</div>

			<Box
				p="lg"
				radius="md"
				maw={480}
				className="bg-white border border-slate-100"
			>
				<Stack gap="md">
					<Group gap="sm">
						<ThemeIcon size={32} radius="md" variant="light" color="wave">
							<IconUser size={18} stroke={1.5} />
						</ThemeIcon>
						<div>
							<Text fw={600} size="sm">
								Voice workflow
							</Text>
							<Text size="xs" c="dimmed">
								Parse scripts and build invoices from the same workspace.
							</Text>
						</div>
					</Group>
					<Button
						component={Link}
						to="/editor"
						variant="light"
						color="wave"
						size="sm"
						leftSection={<IconMicrophone2 size={16} />}
						radius="md"
					>
						Open script editor
					</Button>
				</Stack>
			</Box>
		</Stack>
	);
}
