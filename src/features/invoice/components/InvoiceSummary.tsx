import {
	ActionIcon,
	Box,
	Button,
	Group,
	Modal,
	Paper,
	ScrollArea,
	Stack,
	Table,
	Text,
	TextInput,
	Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { memo, useCallback } from "react";
import { useInvoiceStore } from "../store/invoiceStore";

const borderTopStyle = { borderTop: "1px solid var(--mantine-color-default-border)" };
const flexOneStyle = { flex: 1 };
const itemBoxBorderStyle = {
	border: "1px solid var(--mantine-color-default-border)",
	borderRadius: "var(--mantine-radius-sm)",
};

function InvoiceSummaryInner() {
	const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
	const {
		invoice,
		updateItemName,
		removeSubitem,
		removeItem,
		resetInvoice,
	} = useInvoiceStore();

	const itemTotals = invoice.items.map((item) => ({
		item,
		total: item.subitems.reduce((sum, sub) => sum + sub.amount, 0),
	}));
	const invoiceTotal = itemTotals.reduce((sum, { total }) => sum + total, 0);

	const handleItemNameChange = useCallback(
		(itemId: string, value: string) => updateItemName(itemId, value),
		[updateItemName],
	);
	const handleItemNameBlur = useCallback(
		(itemId: string, trimmed: string, currentName: string) => {
			if (trimmed !== currentName) updateItemName(itemId, trimmed || currentName);
		},
		[updateItemName],
	);
	const handleRemoveItem = useCallback(
		(itemId: string) => {
			if (window.confirm("Remove this item and all its lines?")) removeItem(itemId);
		},
		[removeItem],
	);
	const handleRemoveSubitem = useCallback(
		(itemId: string, subId: string) => removeSubitem(itemId, subId),
		[removeSubitem],
	);
	const handleResetInvoice = useCallback(() => {
		if (window.confirm("Clear all items from this invoice?")) {
			resetInvoice();
			closeEditModal();
		}
	}, [resetInvoice, closeEditModal]);

	if (invoice.items.length === 0) {
		return (
			<Paper pt="md" pb="md">
				<Stack gap="sm">
					<Group justify="space-between" align="center">
						<Text fw={700} size="sm">
							Invoice Summary
						</Text>
					</Group>
					<Text size="sm" c="dimmed">
						No items yet. Add scripts from Documents Overview.
					</Text>
				</Stack>
			</Paper>
		);
	}

	return (
		<>
			<Paper radius="md" p="md" withBorder>
				<Group justify="space-between" align="center" mb="sm">
					<Text fw={700} size="sm">
						Invoice Summary
					</Text>
					<Button
						variant="light"
						size="xs"
						leftSection={<IconEdit size={14} />}
						onClick={openEditModal}
					>
						Edit
					</Button>
				</Group>
				<Stack gap="md">
					{invoice.items.map((item) => {
						const itemTotal = item.subitems.reduce((sum, s) => sum + s.amount, 0);
						return (
							<Box key={item.id}>
								<Text fw={600} size="xs" c="dimmed" mb={4}>
									{item.name}
								</Text>
								<Stack gap={2}>
									{item.subitems.map((sub) => (
										<Group key={sub.id} justify="space-between" gap="xs">
											<Text size="xs" lineClamp={1} style={flexOneStyle}>
												{sub.label ?? sub.scriptName}
											</Text>
											<Text size="xs" c="dimmed">
												{sub.wordCount} × {sub.ratePerWord.toFixed(4)} = {sub.amount.toFixed(2)}
											</Text>
										</Group>
									))}
								</Stack>
								<Text size="xs" fw={600} mt={4}>
									Subtotal: {itemTotal.toFixed(2)}
								</Text>
							</Box>
						);
					})}
				</Stack>
				<Text size="sm" fw={700} mt="md" pt="sm" style={borderTopStyle}>
					Total: {invoiceTotal.toFixed(2)}
				</Text>
			</Paper>

			<Modal
				opened={editModalOpened}
				onClose={closeEditModal}
				title="Invoice"
				size="lg"
				centered
			>
				<Stack gap="lg">
					<Group justify="space-between">
						<Text size="sm" c="dimmed">
							Default rate: {invoice.defaultRatePerWord} per word
						</Text>
					</Group>

					<ScrollArea.Autosize mah={400}>
						{invoice.items.length === 0 ? (
							<Text size="sm" c="dimmed" py="md">
								No items. Add scripts from Documents Overview or close this modal.
							</Text>
						) : (
							<Stack gap="md">
								{invoice.items.map((item) => {
									const itemTotal = item.subitems.reduce((sum, s) => sum + s.amount, 0);
									return (
										<Box
											key={item.id}
											p="sm"
											style={itemBoxBorderStyle}
										>
											<Group justify="space-between" align="center" mb="xs" gap="xs">
												<TextInput
													size="sm"
													value={item.name}
													onChange={(e) =>
														handleItemNameChange(item.id, e.currentTarget.value)
													}
													onBlur={(e) => {
														const trimmed = e.currentTarget.value.trim();
														handleItemNameBlur(item.id, trimmed, item.name);
													}}
													styles={{ input: { fontWeight: 600 } }}
													style={flexOneStyle}
												/>
												<Tooltip label="Remove item">
													<ActionIcon
														color="red"
														variant="light"
														size="sm"
														onClick={() => handleRemoveItem(item.id)}
													>
														<IconTrash size={14} />
													</ActionIcon>
												</Tooltip>
											</Group>
											<Table striped highlightOnHover withTableBorder withColumnBorders>
												<Table.Thead>
													<Table.Tr>
														<Table.Th>Script</Table.Th>
														<Table.Th>Words</Table.Th>
														<Table.Th>Rate/word</Table.Th>
														<Table.Th>Amount</Table.Th>
														<Table.Th w={40} />
													</Table.Tr>
												</Table.Thead>
												<Table.Tbody>
													{item.subitems.map((sub) => (
														<Table.Tr key={sub.id}>
															<Table.Td>{sub.label ?? sub.scriptName}</Table.Td>
															<Table.Td>{sub.wordCount}</Table.Td>
															<Table.Td>{sub.ratePerWord.toFixed(4)}</Table.Td>
															<Table.Td>{sub.amount.toFixed(2)}</Table.Td>
															<Table.Td>
																<Tooltip label="Remove line">
																	<ActionIcon
																		color="red"
																		variant="subtle"
																		size="sm"
																		onClick={() =>
																			handleRemoveSubitem(item.id, sub.id)
																		}
																	>
																		<IconTrash size={14} />
																	</ActionIcon>
																</Tooltip>
															</Table.Td>
														</Table.Tr>
													))}
												</Table.Tbody>
											</Table>
											<Text size="xs" fw={600} mt="xs">
												Subtotal: {itemTotal.toFixed(2)}
											</Text>
										</Box>
									);
								})}
							</Stack>
						)}
					</ScrollArea.Autosize>

					<Box pt="sm" style={borderTopStyle}>
						<Group justify="space-between" align="center">
							<Button
								variant="light"
								color="red"
								size="sm"
								onClick={handleResetInvoice}
							>
								Reset Invoice
							</Button>
							<Text fw={700} size="lg">
								Total: {invoiceTotal.toFixed(2)}
							</Text>
						</Group>
					</Box>
				</Stack>
			</Modal>
		</>
	);
}

export const InvoiceSummary = memo(InvoiceSummaryInner);
