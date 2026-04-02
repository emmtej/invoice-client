import {
	Button,
	Group,
	Paper,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { IconGauge, IconReceipt } from "@tabler/icons-react";
import { Link } from "@tanstack/react-router";

export default function Dashboard() {
	return (
		<Stack gap="lg">
			<div>
				<Title order={2}>Dashboard</Title>
				<Text c="dimmed" size="sm" mt={4}>
					Welcome back. Jump into invoicing or review your recent work.
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
						<ThemeIcon size={48} radius="md" variant="light" color="studio">
							<IconGauge size={28} stroke={1.5} />
						</ThemeIcon>
						<div>
							<Text fw={600}>Get started</Text>
							<Text size="sm" c="dimmed">
								Create an invoice from your script line items and word counts.
							</Text>
						</div>
					</Group>
					<Button
						component={Link}
						to="/invoice"
						color="studio"
						leftSection={<IconReceipt size={18} />}
					>
						Create invoice
					</Button>
				</Stack>
			</Paper>
		</Stack>
	);
}
