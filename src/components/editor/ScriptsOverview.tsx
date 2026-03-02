import { useScriptStore } from "@/store/scriptEditorStore";
import {
	Badge,
	Card,
	Group,
	Paper,
	rem,
	Table,
	Text,
	Title,
} from "@mantine/core";
import { IconFiles, IconInfoCircle } from "@tabler/icons-react";
import { useMemo } from "react";

export function ScriptsOverview() {
	const { scripts } = useScriptStore((store) => store);

	const totalWords = useMemo(() => {
		return scripts.reduce(
			(acc, script) => acc + (script.overview?.wordCount || 0),
			0,
		);
	}, [scripts]);

	const hasScripts = scripts.length > 0;

	return (
		<div className="mx-2">
			<Card padding="sm" radius="sm" withBorder>
				<Group justify="space-between" mb="md">
					<Group gap="xs">
						<IconFiles
							size={20}
							stroke={1.5}
							color="var(--mantine-color-blue-filled)"
						/>
						<Title order={5} fw={600} style={{ letterSpacing: rem(-0.5) }}>
							Documents Overview
						</Title>
						{hasScripts && (
							<Badge variant="light" color="blue" size="sm" radius="xs">
								{scripts.length}
							</Badge>
						)}
					</Group>
				</Group>

				{hasScripts ? (
					<Table variant="simple" verticalSpacing="xs">
						<Table.Thead>
							<Table.Tr>
								<Table.Th c="dimmed" fw={500}>
									<Group gap={4}>File Name</Group>
								</Table.Th>
								<Table.Th c="dimmed" fw={500} ta="right">
									Words
								</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{scripts.map((script) => (
								<Table.Tr key={script.id}>
									<Table.Td>
										<Group gap="sm" wrap="nowrap">
											<Text size="sm" fw={500} truncate="end">
												{script.name}
											</Text>
										</Group>
									</Table.Td>
									<Table.Td ta="right">
										<Text size="sm" ff="monospace">
											{script.overview.wordCount.toLocaleString()}
										</Text>
									</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
						<Table.Tfoot>
							<Table.Tr>
								<Table.Th>
									<Text size="xs" fw={700} tt="uppercase" c="dimmed">
										Total Word Count
									</Text>
								</Table.Th>
								<Table.Th ta="right">
									<Text size="sm" fw={700} c="blue.8" ff="monospace">
										{totalWords.toLocaleString()}
									</Text>
								</Table.Th>
							</Table.Tr>
						</Table.Tfoot>
					</Table>
				) : (
					<Paper withBorder p="sm" bg="var(--mantine-color-gray-0)" radius="xs">
						<Group align="flex-start" gap="sm">
							<IconInfoCircle
								size={18}
								stroke={1.5}
								style={{ marginTop: rem(2) }}
							/>
							<Text size="sm" c="gray.7" style={{ flex: 1 }}>
								No documents detected. <b>Paste</b> or <b>upload</b> files above
								to generate the word count analysis.
							</Text>
						</Group>
					</Paper>
				)}
			</Card>
		</div>
	);
}
