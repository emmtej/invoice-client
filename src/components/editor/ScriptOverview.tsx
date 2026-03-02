import type { Script } from "@/types/Script";
import { Table } from "@mantine/core";

export function ScriptOverview({ script }: { script: Script }) {
	return (
		<div className="m">
			<div>
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
						{script.lines.map((line) => (
							<Table.Tr key={line.id}>
								<Table.Td>{line.type.toUpperCase()}</Table.Td>
								<Table.Td>{line.source}</Table.Td>
							</Table.Tr>
						))}
					</Table.Tbody>
					{/* <Table.Caption>Scroll page to see sticky thead</Table.Caption> */}
				</Table>
			</div>
		</div>
	);
}
