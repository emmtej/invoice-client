import { Group, Paper, Stack, Text } from "@mantine/core";
import { AtSign, User } from "lucide-react";
import type { InvoiceProfile } from "./invoiceProfile";

type ActiveProfileDisplayProps = {
	profile: InvoiceProfile;
};

export function ActiveProfileDisplay({ profile }: ActiveProfileDisplayProps) {
	const fullName = [profile.firstName, profile.lastName]
		.map((s) => s.trim())
		.filter(Boolean)
		.join(" ");

	return (
		<Paper withBorder p="sm" radius="sm" bg="gray.0">
			<Stack gap="xs">
				<Group gap="xs">
					<User size={16} style={{ opacity: 0.7 }} />
					<Text size="sm" fw={500}>
						{fullName || "—"}
					</Text>
				</Group>
				{profile.email?.trim() && (
					<Group gap="xs">
						<AtSign size={16} style={{ opacity: 0.7 }} />
						<Text size="sm" c="dimmed">
							{profile.email}
						</Text>
					</Group>
				)}
			</Stack>
		</Paper>
	);
}
