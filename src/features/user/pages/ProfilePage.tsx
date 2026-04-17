import { Button, Group, Paper, Stack, Text, ThemeIcon } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { Mic, User } from "lucide-react";
import { PageTitle } from "@/components/ui/text/PageTitle";

export default function ProfilePage() {
	return (
		<Stack gap="md">
			<div>
				<PageTitle size="40px">Profile</PageTitle>
				<Text c="gray.5" size="sm" mt={4} className="page-subtitle">
					Account settings and defaults will live here. For now, open the editor
					or invoices to keep working.
				</Text>
			</div>

			<Paper p="lg" maw={480} className="bg-white border border-gray-100">
				<Stack gap="md">
					<Group gap="sm">
						<ThemeIcon size={32} variant="light" color="wave">
							<User size={18} strokeWidth={1.5} />
						</ThemeIcon>
						<div>
							<Text fw={600} size="sm">
								Voice workflow
							</Text>
							<Text size="xs" c="gray.5">
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
						leftSection={<Mic size={16} />}
					>
						Open script editor
					</Button>
				</Stack>
			</Paper>
		</Stack>
	);
}
