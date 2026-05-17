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
					<Table.Th className="text-brand-dark-300">
						Line Item / Description
					</Table.Th>
					<Table.Th className="text-brand-dark-300 text-right">Qty</Table.Th>
					<Table.Th className="text-brand-dark-300 text-right">Rate</Table.Th>
					<Table.Th className="text-brand-dark-300 text-right">Total</Table.Th>
					<Table.Th w={50} />
				</Table.Tr>
			</Table.Thead>
			<Table.Tbody>
				{subitems.map((sub) => (
					<Table.Tr
						key={sub.id}
						className="border-b border-sage-50 last:border-0"
					>
						<Table.Td>
							<Stack gap={2}>
								<Group gap={6}>
									<Text size="sm" fw={700} c="brand-dark.7">
										{sub.label || "Service Item"}
									</Text>
									<ActionIcon
										variant="subtle"
										color="sage"
										size="xs"
										radius="md"
										onClick={() => onEditSubitem(sub, "label")}
									>
										<Pencil size={12} />
									</ActionIcon>
								</Group>
								<Text size="xs" c="sage.6" fw={500}>
									{sub.scriptName}
								</Text>
							</Stack>
						</Table.Td>
						<Table.Td className="text-right">
							<Text
								size="sm"
								fw={600}
								className="tabular-nums"
								c="brand-dark.6"
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
									c="brand-dark.6"
								>
									${sub.ratePerWord.toFixed(2)}
								</Text>
								<ActionIcon
									variant="subtle"
									color="sage"
									size="xs"
									radius="md"
									onClick={() => onEditSubitem(sub, "rate")}
								>
									<Pencil size={12} />
								</ActionIcon>
							</Group>
						</Table.Td>
						<Table.Td className="text-right">
							<Text size="sm" fw={800} c="forest.9" className="tabular-nums">
								${sub.amount.toFixed(2)}
							</Text>
						</Table.Td>
						<Table.Td className="text-right">
							<ActionIcon
								variant="subtle"
								color="terracotta"
								radius="md"
								onClick={() => onDeleteSubitem(sub.id)}
								size="sm"
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
