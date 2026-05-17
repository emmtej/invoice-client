import { Badge, Group, Table, Text, ThemeIcon } from "@mantine/core";
import { AlertCircle, MessageSquare, Tag, Zap } from "lucide-react";
import { memo } from "react";
import type { ParsedLine } from "@/types/Script";

const TYPE_CONFIG = {
	dialogue: {
		icon: MessageSquare,
		color: "wave",
		label: "Dialogue",
	},
	action: {
		icon: Zap,
		color: "sage",
		label: "Action",
	},
	marker: {
		icon: Tag,
		color: "gray",
		label: "Marker",
	},
	malformed: {
		icon: AlertCircle,
		color: "orange",
		label: "Malformed",
	},
	invalid: {
		icon: AlertCircle,
		color: "on-air-red",
		label: "Invalid",
	},
} as const;

export const TypeBadge = memo(({ type }: { type: ParsedLine["type"] }) => {
	const config =
		TYPE_CONFIG[type as keyof typeof TYPE_CONFIG] || TYPE_CONFIG.marker;
	const Icon = config.icon;

	return (
		<Group gap={8} wrap="nowrap">
			<ThemeIcon
				variant="transparent"
				color={config.color}
				size="sm"
				radius="md"
			>
				<Icon size={14} strokeWidth={2.5} />
			</ThemeIcon>
			<Text size="xs" fw={600} c="brand-dark.4" tt="uppercase" lts="0.05em">
				{config.label}
			</Text>
		</Group>
	);
});

export const ScriptLineRow = memo(({ line }: { line: ParsedLine }) => {
	return (
		<Table.Tr className="transition-colors hover:bg-brand-dark-50/50">
			<Table.Td py="md" w={180}>
				<TypeBadge type={line.type} />
			</Table.Td>
			<Table.Td py="md">
				<Group justify="space-between" wrap="nowrap" align="center" gap="xl">
					<Text
						size="md"
						c="brand-dark.8"
						fw={500}
						className="leading-relaxed flex-1"
					>
						{line.source}
					</Text>
					{line.type === "dialogue" && (
						<Badge
							variant="outline"
							color="brand-dark.5"
							size="sm"
							radius="xl"
							className="border-dashed bg-white flex-shrink-0"
							styles={{
								label: {
									color: "var(--mantine-color-brand-dark-4)",
									fontWeight: 700,
								},
							}}
						>
							{line.metadata.wordCount} words
						</Badge>
					)}
				</Group>
			</Table.Td>
		</Table.Tr>
	);
});
