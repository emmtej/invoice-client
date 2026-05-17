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

export default function DashboardView() {
	return (
		<Stack gap="md">
			<Box mb="xl">
				<PageTitle>Dashboard</PageTitle>
				<Text c="brand-dark.4" size="lg" mt={4} className="page-subtitle">
					Welcome back. Jump into invoicing or review your recent work.
				</Text>
			</Box>

			<Paper
				radius="3xl"
				p="lg"
				maw={480}
				bg="white"
				withBorder
				className="border-gray-100 shadow-sm"
			>
				<Stack gap="md">
					<Group gap="sm">
						<ThemeIcon size={32} variant="light" color="wave" radius="md">
							<Gauge size={18} strokeWidth={1.5} />
						</ThemeIcon>
						<div>
							<Text fw={600} size="sm" c="brand-dark.7">
								Get started
							</Text>
							<Text size="xs" c="brand-dark.3">
								Create an invoice from your script line items and word counts.
							</Text>
						</div>
					</Group>
					<Button
						component={Link}
						to="/invoice"
						color="wave"
						size="sm"
						radius="xl"
						leftSection={<Receipt size={16} />}
						className="shadow-sm transition-transform active:scale-95"
					>
						Create invoice
					</Button>
				</Stack>
			</Paper>
		</Stack>
	);
}
