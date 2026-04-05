import {
	Button,
	Group,
	Paper,
	Stack,
	Text,
	ThemeIcon,
	Title,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { Gauge, Receipt } from "lucide-react";

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

			<Paper p="lg" maw={480} bg="white">
				<Stack gap="md">
					<Group gap="sm">
						<ThemeIcon size={32} radius="md" variant="light" color="wave">
							<Gauge size={18} strokeWidth={1.5} />
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
						color="wave"
						size="sm"
						leftSection={<Receipt size={16} />}
						radius="md"
					>
						Create invoice
					</Button>
				</Stack>
			</Paper>
		</Stack>
	);
}
