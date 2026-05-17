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
import { Mic, User } from "lucide-react";
import { PageTitle } from "@/components/ui/PageTitle";

export default function ProfileView() {
	return (
		<Stack gap="md">
			<Box mb="xl">
				<PageTitle>Profile</PageTitle>
				<Text c="dimmed" size="sm" mt={4}>
					Account settings and defaults will live here. For now, open the editor
					or invoices to keep working.
				</Text>
			</Box>

			<Paper
				
				p="lg"
				maw={480}
				bg="white"
				withBorder
				className="shadow-sm"
			>
				<Stack gap="md">
					<Group gap="sm">
						<ThemeIcon size={32} variant="light" color="blue" radius="md">
							<User size={18} strokeWidth={1.5} />
						</ThemeIcon>
						<div>
							<Text fw={600} size="sm" >
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
						color="blue"
						size="sm"
						radius="xl"
						leftSection={<Mic size={16} />}
						className="shadow-sm transition-transform active:scale-95"
					>
						Open script editor
					</Button>
				</Stack>
			</Paper>
		</Stack>
	);
}
