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
		<Stack gap="md">
			<div>
				<Title order={2} fw={800} size="h3">
					Dashboard
				</Title>
				<Text c="dimmed" size="sm" mt={4}>
					Welcome back. Jump into invoicing or review your recent work.
				</Text>
			</div>

			<Paper
				p="lg"
				radius="md"
				maw={480}
				className="bg-white border border-slate-100"
			>
				<Stack gap="md">
					<Group gap="sm">
						<ThemeIcon size={32} radius="md" variant="light" color="studio">
							<IconGauge size={18} stroke={1.5} />
						</ThemeIcon>
						<div>
							<Text fw={600} size="sm">
								Get started
							</Text>
							<Text size="xs" c="dimmed">
								Create an invoice from your script line items and word counts.
							</Text>
						</div>
					</Group>
					<Button
						component={Link}
						to="/invoice"
						color="studio"
						size="sm"
						leftSection={<IconReceipt size={16} />}
						radius="md"
					>
						Create invoice
					</Button>
				</Stack>
			</Paper>
		</Stack>
	);
}
