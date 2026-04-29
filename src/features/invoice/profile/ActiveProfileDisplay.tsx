import { Box, Group, Image, Paper, Stack, Text } from "@mantine/core";
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
		<Paper p="md" bg="transparent" className="border border-black/5">
			<Group gap="md" align="flex-start">
				{profile.avatarUrl ? (
					<Box
						style={{
							width: 64,
							height: 80,
							overflow: "hidden",
							clipPath: "ellipse(50% 100% at 50% 100%)", // Arch effect
							borderRadius: "32px 32px 0 0", // Alternative arch
						}}
					>
						<Image
							src={profile.avatarUrl}
							alt={fullName}
							w="100%"
							h="100%"
							fit="cover"
						/>
					</Box>
				) : (
					<Box
						bg="sage.0"
						style={{
							width: 64,
							height: 80,
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							borderRadius: "32px 32px 0 0", // Arch shape
						}}
					>
						<User size={32} className="text-sage-300" strokeWidth={1.5} />
					</Box>
				)}
				<Stack gap="xs" style={{ flex: 1 }}>
					<Group gap="xs">
						<Text size="sm" fw={700} c="forest.9">
							{fullName || "—"}
						</Text>
					</Group>
					{profile.email?.trim() && (
						<Group gap="xs">
							<AtSign size={14} className="text-sage-400" strokeWidth={2} />
							<Text size="xs" c="sage.6">
								{profile.email}
							</Text>
						</Group>
					)}
				</Stack>
			</Group>
		</Paper>
	);
}
