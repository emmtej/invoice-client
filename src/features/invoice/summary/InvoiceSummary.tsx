import {
	ActionIcon,
	Box,
	Button,
	Divider,
	Flex,
	Group,
	Paper,
	Stack,
	Table,
	Text,
	Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { memo, useCallback, useState } from "react";
import { AddDocumentsToItemModal } from "../items";
import { getTodayDateString, type InvoiceProfile } from "../profile";
import { useInvoiceStore } from "../store/invoiceStore";

const borderTopStyle = {
	borderTop: "1px solid var(--mantine-color-default-border)",
};
const flexOneStyle = { flex: 1 };

type InvoiceSummaryProps = {
	profile?: InvoiceProfile;
	invoiceTitle: string;
	invoiceDate: string;
};

export const InvoiceSummary = memo(
	({ profile, invoiceTitle, invoiceDate }: InvoiceSummaryProps) => {
		const {
			invoice,
			removeItem,
			removeSubitem,
			updateSubitemRate,
			updateSubitemLabel,
			updateItemName,
		} = useInvoiceStore();
		const [modalOpened, { open, close }] = useDisclosure(false);
		const [activeItemId, setActiveItemId] = useState<{
			id: string;
			name: string;
		} | null>(null);

		const handleOpenUpload = useCallback(
			(id: string, name: string) => {
				setActiveItemId({ id, name });
				open();
			},
			[open],
		);

		const items = invoice.items;
		const totalAmount = items.reduce((sum, item) => {
			const itemTotal = item.subitems.reduce((s, sub) => s + sub.amount, 0);
			return sum + itemTotal;
		}, 0);

		const handleUpdateItemName = (itemId: string, currentName: string) => {
			const newName = prompt("Enter new item name:", currentName);
			if (newName !== null) {
				updateItemName(itemId, newName);
			}
		};

		const handleUpdateSubitemLabel = (
			itemId: string,
			subitemId: string,
			currentLabel: string,
		) => {
			const newLabel = prompt("Enter new label:", currentLabel);
			if (newLabel !== null) {
				updateSubitemLabel(itemId, subitemId, newLabel);
			}
		};

		const handleUpdateSubitemRate = (
			itemId: string,
			subitemId: string,
			currentRate: number,
		) => {
			const newRate = prompt("Enter new rate per word:", currentRate.toString());
			if (newRate !== null) {
				const val = Number.parseFloat(newRate);
				if (!Number.isNaN(val)) {
					updateSubitemRate(itemId, subitemId, val);
				}
			}
		};

		return (
			<Box mt="xl">
				<Divider
					mb="md"
					label={
						<Text fw={700} size="lg">
							Summary
						</Text>
					}
					labelPosition="left"
				/>

				<Paper withBorder p="md" radius="md" bg="var(--mantine-color-body)">
					<Stack gap="md">
						<Flex justify="space-between" align="flex-start">
							<Box>
								<Text size="xl" fw={800} tt="uppercase" lts={1}>
									{invoiceTitle}
								</Text>
								<Text size="sm" c="dimmed">
									Date: {invoiceDate || getTodayDateString()}
								</Text>
							</Box>
							{profile && (
								<Box style={{ textAlign: "right" }}>
									<Text fw={700}>
										{profile.firstName} {profile.lastName}
									</Text>
									<Text size="sm" c="dimmed">
										{profile.email}
									</Text>
								</Box>
							)}
						</Flex>

						<Table verticalSpacing="sm">
							<Table.Thead>
								<Table.Tr>
									<Table.Th style={flexOneStyle}>Description</Table.Th>
									<Table.Th w={120} style={{ textAlign: "right" }}>
										Words
									</Table.Th>
									<Table.Th w={120} style={{ textAlign: "right" }}>
										Rate ($/w)
									</Table.Th>
									<Table.Th w={120} style={{ textAlign: "right" }}>
										Amount
									</Table.Th>
									<Table.Th w={100} />
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{items.map((item) => {
									const itemWordCount = item.subitems.reduce(
										(s, sub) => s + sub.wordCount,
										0,
									);
									const itemAmount = item.subitems.reduce(
										(s, sub) => s + sub.amount,
										0,
									);

									return (
										<Table.Tr key={item.id}>
											<Table.Td>
												<Stack gap={0}>
													<Group gap="xs">
														<Text fw={500}>{item.name}</Text>
														<Tooltip label="Edit item name">
															<ActionIcon
																size="xs"
																variant="subtle"
																onClick={() =>
																	handleUpdateItemName(item.id, item.name)
																}
															>
																<IconEdit size={12} />
															</ActionIcon>
														</Tooltip>
													</Group>
													{item.subitems.map((sub) => (
														<Box key={sub.id} mt={4}>
															<Group justify="space-between" wrap="nowrap">
																<Group gap={4} style={{ flex: 1 }}>
																	<Text size="xs" c="dimmed">
																		• {sub.label || sub.scriptName}
																	</Text>
																	<ActionIcon
																		size="xs"
																		variant="subtle"
																		onClick={() =>
																			handleUpdateSubitemLabel(
																				item.id,
																				sub.id,
																				sub.label || sub.scriptName,
																			)
																		}
																	>
																		<IconEdit size={10} />
																	</ActionIcon>
																</Group>
																<Group gap="xs">
																	<Text size="xs" c="dimmed">
																		${sub.ratePerWord.toFixed(3)}
																	</Text>
																	<ActionIcon
																		size="xs"
																		variant="subtle"
																		onClick={() =>
																			handleUpdateSubitemRate(
																				item.id,
																				sub.id,
																				sub.ratePerWord,
																			)
																		}
																	>
																		<IconEdit size={10} />
																	</ActionIcon>
																	<ActionIcon
																		size="xs"
																		variant="subtle"
																		color="red"
																		onClick={() =>
																			removeSubitem(item.id, sub.id)
																		}
																	>
																		<IconTrash size={12} />
																	</ActionIcon>
																</Group>
															</Group>
														</Box>
													))}
												</Stack>
											</Table.Td>
											<Table.Td style={{ textAlign: "right" }}>
												<Text size="sm">{itemWordCount.toLocaleString()}</Text>
											</Table.Td>
											<Table.Td style={{ textAlign: "right" }}>
												{item.subitems.length === 1 ? (
													<Text size="sm">
														${item.subitems[0].ratePerWord.toFixed(3)}
													</Text>
												) : (
													<Text size="sm" c="dimmed">
														—
													</Text>
												)}
											</Table.Td>
											<Table.Td style={{ textAlign: "right" }}>
												<Text fw={600}>${itemAmount.toFixed(2)}</Text>
											</Table.Td>
											<Table.Td>
												<Group gap="xs" justify="flex-end">
													<Tooltip label="Add documents">
														<ActionIcon
															variant="light"
															color="blue"
															onClick={() =>
																handleOpenUpload(item.id, item.name)
															}
														>
															<IconPlus size={16} />
														</ActionIcon>
													</Tooltip>
													<Tooltip label="Remove item">
														<ActionIcon
															variant="light"
															color="red"
															onClick={() => removeItem(item.id)}
														>
															<IconTrash size={16} />
														</ActionIcon>
													</Tooltip>
												</Group>
											</Table.Td>
										</Table.Tr>
									);
								})}
							</Table.Tbody>
						</Table>

						<Box py="sm" mt="xs" style={borderTopStyle}>
							<Group justify="flex-end" gap="xl">
								<Text fw={700} size="lg">
									Total Amount
								</Text>
								<Text fw={800} size="xl" c="blue">
									${totalAmount.toFixed(2)}
								</Text>
							</Group>
						</Box>

						<Group justify="flex-end" mt="md">
							<Button
								variant="filled"
								size="md"
								onClick={() => window.print()}
								disabled={items.length === 0}
							>
								Download Invoice (PDF)
							</Button>
						</Group>
					</Stack>
				</Paper>

				{activeItemId && (
					<AddDocumentsToItemModal
						itemId={activeItemId.id}
						itemName={activeItemId.name}
						opened={modalOpened}
						onClose={close}
					/>
				)}
			</Box>
		);
	},
);

InvoiceSummary.displayName = "InvoiceSummary";
