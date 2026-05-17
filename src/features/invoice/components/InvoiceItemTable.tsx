import { ActionIcon, Group, Stack, Table, Text } from "@mantine/core";
import { Pencil, Trash2 } from "lucide-react";
import type { InvoiceSubitem } from "../store/invoiceStore";

interface InvoiceItemTableProps {
	subitems: InvoiceSubitem[];
	onEditSubitem: (sub: InvoiceSubitem, field: "label" | "rate") => void;
	onDeleteSubitem: (subId: string) => void;
}

export function InvoiceItemTable({
	subitems,
	onEditSubitem,
	onDeleteSubitem,
}: InvoiceItemTableProps) {
	return (
		<Table verticalSpacing="md" horizontalSpacing="sm">
			<Table.Thead>
				<Table.Tr>
					<Table.Th>
						Line Item / Description
					</Table.Th>
					<Table.Th className="text-right">Qty</Table.Th>
					<Table.Th className="text-right">Rate</Table.Th>
					<Table.Th className="text-right">Total</Table.Th>
					<Table.Th w={50} />
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>
				{subitems.map((sub) => (
					<Table.Tr
						key={sub.id}
						className="border-b last:border-0"
					>
						<Table.Td>
							<Stack gap={2}>
								<Group gap={6}>
									<Text size="sm" fw={700} >
										{sub.label || "Service Item"}
									</Text>
									<ActionIcon
										variant="subtle"
										color="gray"
										size="xs"
										radius="md"
										onClick={() => onEditSubitem(sub, "label")}
										aria-label="Edit description"
									>
										<Pencil size={12} />
									</ActionIcon>
								</Group>
								<Text size="xs" c="dimmed" fw={500}>
									{sub.scriptName}
								</Text>
							</Stack>
						</Table.Td>
						<Table.Td className="text-right">
							<Text
								size="sm"
								fw={600}
								className="tabular-nums"
								c="dimmed"
							>
								{sub.wordCount.toLocaleString()}
							</Text>
						</Table.Td>
						<Table.Td className="text-right">
							<Group justify="flex-end" gap={4}>
								<Text
									size="sm"
									fw={600}
									className="tabular-nums"
									c="dimmed"
								>
									${sub.ratePerWord.toFixed(2)}
								</Text>
								<ActionIcon
									variant="subtle"
									color="gray"
									size="xs"
									radius="md"
									onClick={() => onEditSubitem(sub, "rate")}
									aria-label="Edit rate"
								>
									<Pencil size={12} />
								</ActionIcon>
							</Group>
						</Table.Td>
						<Table.Td className="text-right">
							<Text size="sm" fw={800} className="tabular-nums">
								${sub.amount.toFixed(2)}
							</Text>
						</Table.Td>
						<Table.Td className="text-right">
							<ActionIcon
								variant="subtle"
								color="blue"
								radius="md"
								onClick={() => onDeleteSubitem(sub.id)}
								size="sm"
								aria-label="Delete line item"
							>
								<Trash2 size={14} />
							</ActionIcon>
						</Table.Td>
					</Table.Tr>
				))}
			</Table.Tbody>
		</Table>
	);
}
