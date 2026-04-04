import {
	ActionIcon,
	Box,
	Button,
	Divider,
	Flex,
	Group,
	Stack,
	Table,
	Text,
	Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconEdit, IconPlus, IconTrash } from "@tabler/icons-react";
import { Fragment, memo, useCallback, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { EditValueModal, ExportModal } from "../components";
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
		} = useInvoiceStore(
			useShallow((s) => ({
				invoice: s.invoice,
				removeItem: s.removeItem,
				removeSubitem: s.removeSubitem,
				updateSubitemRate: s.updateSubitemRate,
				updateSubitemLabel: s.updateSubitemLabel,
				updateItemName: s.updateItemName,
			})),
		);
		const [modalOpened, { open, close }] = useDisclosure(false);
		const [exportModalOpened, { open: openExport, close: closeExport }] =
			useDisclosure(false);
		const [activeItemId, setActiveItemId] = useState<{
			id: string;
			name: string;
		} | null>(null);

		const [editModalConfig, setEditModalConfig] = useState<{
			opened: boolean;
			title: string;
			label: string;
			inputType: "text" | "number";
			initialValue: string | number;
			onConfirm: (val: string | number) => void;
		}>({
			opened: false,
			title: "",
			label: "",
			inputType: "text",
			initialValue: "",
			onConfirm: () => {},
		});

		const handleOpenUpload = useCallback(
			(id: string, name: string) => {
				setActiveItemId({ id, name });
				open();
			},
			[open],
		);

		const closeEditModal = () => {
			setEditModalConfig((prev) => ({ ...prev, opened: false }));
		};

		const items = invoice.items;
		const totalAmount = items.reduce((sum, item) => {
			const itemTotal = item.subitems.reduce((s, sub) => s + sub.amount, 0);
			return sum + itemTotal;
		}, 0);

		const handleUpdateItemName = (itemId: string, currentName: string) => {
			setEditModalConfig({
				opened: true,
				title: "Edit Item Name",
				label: "New item name:",
				inputType: "text",
				initialValue: currentName,
				onConfirm: (val) => updateItemName(itemId, val as string),
			});
		};

		const handleUpdateSubitemLabel = (
			itemId: string,
			subitemId: string,
			currentLabel: string,
		) => {
			setEditModalConfig({
				opened: true,
				title: "Edit Label",
				label: "New label:",
				inputType: "text",
				initialValue: currentLabel,
				onConfirm: (val) =>
					updateSubitemLabel(itemId, subitemId, val as string),
			});
		};

		const handleUpdateSubitemRate = (
			itemId: string,
			subitemId: string,
			currentRate: number,
		) => {
			setEditModalConfig({
				opened: true,
				title: "Edit Rate",
				label: "New rate per word ($):",
				inputType: "number",
				initialValue: currentRate,
				onConfirm: (val) => updateSubitemRate(itemId, subitemId, Number(val)),
			});
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

				<Box p={0}>
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

						<Table verticalSpacing="sm" highlightOnHover>
							<Table.Thead>
								<Table.Tr
									style={{
										backgroundColor:
											"light-dark(var(--mantine-color-primary-0), var(--mantine-color-dark-6))",
									}}
								>
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
								{items.map((item) => (
									<Fragment key={item.id}>
										<Table.Tr
											style={{
												backgroundColor:
													"light-dark(var(--mantine-color-studio-0), var(--mantine-color-dark-6))",
											}}
										>
											<Table.Td>
												<Group gap="xs">
													<Text fw={700}>{item.name}</Text>
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
											</Table.Td>
											<Table.Td colSpan={3} />
											<Table.Td>
												<Group gap="xs" justify="flex-end">
													<Tooltip label="Add documents">
														<ActionIcon
															variant="light"
															color="wave"
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

										{item.subitems.map((sub, subIdx) => (
											<Table.Tr
												key={sub.id}
												style={{
													backgroundColor:
														subIdx % 2 === 0
															? "light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-8))"
															: undefined,
												}}
											>
												<Table.Td
													style={{ paddingLeft: "var(--mantine-spacing-lg)" }}
												>
													<Group gap={4} wrap="nowrap">
														<Text size="sm">{sub.label || sub.scriptName}</Text>
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
												</Table.Td>
												<Table.Td style={{ textAlign: "right" }}>
													<Text size="sm">
														{sub.wordCount.toLocaleString()}
													</Text>
												</Table.Td>
												<Table.Td style={{ textAlign: "right" }}>
													<Group gap={4} justify="flex-end" wrap="nowrap">
														<Text size="sm">${sub.ratePerWord.toFixed(3)}</Text>
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
													</Group>
												</Table.Td>
												<Table.Td style={{ textAlign: "right" }}>
													<Text fw={600} size="sm">
														${sub.amount.toFixed(2)}
													</Text>
												</Table.Td>
												<Table.Td>
													<Group justify="flex-end">
														<Tooltip label="Remove subitem">
															<ActionIcon
																size="xs"
																variant="subtle"
																color="red"
																onClick={() => removeSubitem(item.id, sub.id)}
															>
																<IconTrash size={12} />
															</ActionIcon>
														</Tooltip>
													</Group>
												</Table.Td>
											</Table.Tr>
										))}
									</Fragment>
								))}
							</Table.Tbody>
						</Table>

						<Box py="sm" mt="xs" style={borderTopStyle}>
							<Group justify="flex-end" gap="xl">
								<Text fw={700} size="lg">
									Total Amount
								</Text>
								<Text fw={800} size="xl" c="studio.7">
									${totalAmount.toFixed(2)}
								</Text>
							</Group>
						</Box>

						<Group justify="flex-end" mt="md">
							<Button
								variant="filled"
								color="studio"
								size="md"
								onClick={openExport}
								disabled={items.length === 0}
							>
								Export
							</Button>
						</Group>
					</Stack>
				</Box>

				{activeItemId && (
					<AddDocumentsToItemModal
						itemId={activeItemId.id}
						itemName={activeItemId.name}
						opened={modalOpened}
						onClose={close}
					/>
				)}

				<ExportModal
					opened={exportModalOpened}
					onClose={closeExport}
					items={items}
					onDownloadPDF={() => window.print()}
				/>

				<EditValueModal
					opened={editModalConfig.opened}
					onClose={closeEditModal}
					onConfirm={editModalConfig.onConfirm}
					initialValue={editModalConfig.initialValue}
					title={editModalConfig.title}
					label={editModalConfig.label}
					inputType={editModalConfig.inputType}
				/>
			</Box>
		);
	},
);

InvoiceSummary.displayName = "InvoiceSummary";
