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
		<Paper
			p="md"
			radius="xl"
			bg="gray.0"
			style={{ border: "1px solid #F3F4F6" }}
		>
			<Stack gap="xs">
				<Group gap="xs">
					<User size={16} className="text-gray-400" strokeWidth={2} />
					<Text size="sm" fw={600} c="gray.8">
						{fullName || "—"}
					</Text>
				</Group>
				{profile.email?.trim() && (
					<Group gap="xs">
						<AtSign size={16} className="text-gray-400" strokeWidth={2} />
						<Text size="sm" c="gray.5">
							{profile.email}
						</Text>
					</Group>
				)}
			</Stack>
		</Paper>
	);
}
