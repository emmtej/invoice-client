import {
	Box,
	Button,
	Group,
	Paper,
	Stack,
	Text,
	ThemeIcon,
} from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { Gauge, Receipt } from "lucide-react";
import { PageTitle } from "@/components/ui/text/PageTitle";

export default function Dashboard() {
	return (
		<Stack gap="md">
			<Box mb="xl">
				<PageTitle>Dashboard</PageTitle>
				<Text c="gray.5" size="lg" mt={4} className="page-subtitle">
					Welcome back. Jump into invoicing or review your recent work.
				</Text>
			</Box>

			<Paper p="lg" maw={480} bg="white">
				<Stack gap="md">
					<Group gap="sm">
						<ThemeIcon size={32} variant="light" color="wave">
							<Gauge size={18} strokeWidth={1.5} />
						</ThemeIcon>
						<div>
							<Text fw={600} size="sm">
								Get started
							</Text>
							<Text size="xs" c="gray.5">
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
					>
						Create invoice
					</Button>
				</Stack>
			</Paper>
		</Stack>
	);
}
