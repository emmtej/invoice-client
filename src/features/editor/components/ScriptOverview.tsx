import type { Script } from "@/types/Script";
import { Button, Table } from "@mantine/core";

interface ScriptOverviewProps {
	script: Script;
	onEdit?: () => void;
}

export function ScriptOverview({ script, onEdit }: ScriptOverviewProps) {
	return (
		<div className="m">
			<div>
				{onEdit && (
					<Button mb="sm" onClick={onEdit}>
						Edit
					</Button>
				)}
				<Table
					stickyHeader
					stickyHeaderOffset={60}
					captionSide="bottom"
					striped
				>
					<Table.Caption>Invalid Lines</Table.Caption>
					<Table.Thead>
						<Table.Tr>
							<Table.Th>Line</Table.Th>
							<Table.Th>Type</Table.Th>
						</Table.Tr>
					</Table.Thead>
					<Table.Tbody>
						{script.lines.map((line, index) => (
							<Table.Tr key={`${index}-${line.type}`}>
								<Table.Td>{line.type.toUpperCase()}</Table.Td>
								<Table.Td>{line.source}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
				</Table>
			</div>
		</div>
	);
}
