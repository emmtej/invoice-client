import {
	Box,
	Button,
	Checkbox,
	Group,
	Modal,
	NumberInput,
	Paper,
	Radio,
	Select,
	Stack,
	Table,
	Text,
	TextInput,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconBookmark, IconFileText } from "@tabler/icons-react";
import { memo, useCallback, useEffect, useState } from "react";
import { useSubitemPresets } from "@/features/invoice/presets/useSubitemPresets";
import { useInvoiceStore } from "@/features/invoice/store/invoiceStore";
import type { Script } from "@/types/Script";

const paperOverflowStyle = { overflow: "hidden" as const };
const tableLayoutStyle = { tableLayout: "fixed" as const, width: "100%" };
const numberInputFlexStyle = { flex: 1 };
const numberInputWidthStyle = { width: 100 };

interface UploadDocumentsOverviewProps {
	scripts: Script[];
	/** Called after scripts are successfully added to the invoice. Use to e.g. clear uploaded documents. */
	onAddedToInvoice?: () => void;
	/** When set, only add to this invoice item; hide "Add to existing vs new" and item selector. Same form (preset, subitem label, rate) as Editor. */
	targetItemId?: string;
	targetItemName?: string;
}

type AddToMode = "existing" | "new";

function UploadDocumentsOverviewInner({
	scripts,
	onAddedToInvoice,
	targetItemId,
	targetItemName,
}: UploadDocumentsOverviewProps) {
	const [selectedScriptIds, setSelectedScriptIds] = useState<Set<string>>(
		new Set(),
	);
	const [addModalOpened, { open: openAddModal, close: closeAddModal }] =
		useDisclosure(false);
	const [addMode, setAddMode] = useState<AddToMode>("new");
	const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
	const [newItemName, setNewItemName] = useState("");
	const [subitemLabel, setSubitemLabel] = useState("");
	const [rateAmount, setRateAmount] = useState<number | "">("");
	const [ratePerWords, setRatePerWords] = useState<number | "">("");
	const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
	const [addError, setAddError] = useState<string | null>(null);

	const { invoice, addSubitemsToItem, addSubitemsAsNewItem } =
		useInvoiceStore();
	const { presetOptions, addPreset, getPresetById } = useSubitemPresets();
	const defaultRatePerWord = invoice.defaultRatePerWord;
	const hasItems = invoice.items.length > 0;
	const selectedPreset = selectedPresetId
		? getPresetById(selectedPresetId)
		: null;

	useEffect(() => {
		setSelectedScriptIds(new Set(scripts.map((s) => s.id)));
	}, [scripts]);

	const toggleScript = useCallback((scriptId: string) => {
		setSelectedScriptIds((prev) => {
			const next = new Set(prev);
			if (next.has(scriptId)) next.delete(scriptId);
			else next.add(scriptId);
			return next;
		});
	}, []);

	const selectAll = useCallback(() => {
		setSelectedScriptIds(new Set(scripts.map((s) => s.id)));
	}, [scripts]);

	const deselectAll = useCallback(() => {
		setSelectedScriptIds(new Set());
	}, []);

	const allSelected =
		scripts.length > 0 && selectedScriptIds.size === scripts.length;
	const someSelected = selectedScriptIds.size > 0;

	const handleOpenAddModal = useCallback(() => {
		setAddMode(hasItems ? "existing" : "new");
		setSelectedItemId(hasItems ? invoice.items[0].id : null);
		setNewItemName("");
		setSubitemLabel("");
		setRateAmount("");
		setRatePerWords("");
		setSelectedPresetId(null);
		setAddError(null);
		openAddModal();
	}, [hasItems, invoice.items, openAddModal]);

	const handleAddToInvoice = useCallback(() => {
		const selectedIds = Array.from(selectedScriptIds);
		const selectedScripts = scripts.filter((s) => selectedScriptIds.has(s.id));
		if (selectedScripts.length === 0) return;

		if (targetItemId) {
			const amount = rateAmount !== "" ? Number(rateAmount) : NaN;
			const perWords = ratePerWords !== "" ? Number(ratePerWords) : NaN;
			const rate =
				Number.isFinite(amount) && Number.isFinite(perWords) && perWords > 0
					? amount / perWords
					: undefined;
			addSubitemsToItem(
				selectedIds,
				targetItemId,
				selectedScripts,
				subitemLabel.trim(),
				rate,
			);
			closeAddModal();
			setSelectedScriptIds(new Set());
			onAddedToInvoice?.();
			return;
		}

		if (addMode === "existing" && selectedItemId) {
			const currentInvoice = useInvoiceStore.getState().invoice;
			const itemExists = currentInvoice.items.some(
				(item) => item.id === selectedItemId,
			);
			if (!itemExists) {
				setAddError(
					"The selected invoice item was removed. Please choose another item or create a new one.",
				);
				return;
			}
		}
		setAddError(null);

		const amount = rateAmount !== "" ? Number(rateAmount) : NaN;
		const perWords = ratePerWords !== "" ? Number(ratePerWords) : NaN;
		const rate =
			Number.isFinite(amount) && Number.isFinite(perWords) && perWords > 0
				? amount / perWords
				: undefined;

		if (addMode === "existing" && selectedItemId) {
			addSubitemsToItem(
				selectedIds,
				selectedItemId,
				selectedScripts,
				subitemLabel.trim(),
				rate,
			);
		} else if (addMode === "new" && newItemName.trim()) {
			addSubitemsAsNewItem(
				selectedIds,
				newItemName.trim(),
				selectedScripts,
				subitemLabel.trim(),
				rate,
			);
		} else return;

		closeAddModal();
		setSelectedScriptIds(new Set());
		onAddedToInvoice?.();
	}, [
		selectedScriptIds,
		scripts,
		targetItemId,
		addMode,
		selectedItemId,
		newItemName,
		subitemLabel,
		rateAmount,
		ratePerWords,
		addSubitemsToItem,
		addSubitemsAsNewItem,
		closeAddModal,
		onAddedToInvoice,
	]);

	const totalBillableWords = scripts.reduce(
		(acc, script) => acc + script.overview.wordCount,
		0,
	);
	const selectedWords = scripts
		.filter((s) => selectedScriptIds.has(s.id))
		.reduce((acc, s) => acc + s.overview.wordCount, 0);

	if (scripts.length === 0) {
		return (
			<Paper pt="md">
				<Stack gap="sm">
					<Group gap="xs">
						<IconFileText size={18} color="var(--mantine-color-gray-6)" />
						<Text fw={700} size="sm">
							No documents yet
						</Text>
					</Group>
					<Text size="sm" c="dimmed">
						Upload one or more documents to see billable dialogue word counts
						here.
					</Text>
				</Stack>
			</Paper>
		);
	}

	return (
		<>
			<Stack gap={0}>
				<Paper radius="md" p={0} style={paperOverflowStyle}>
					<Table stickyHeader highlightOnHover style={tableLayoutStyle}>
						<Table.Thead>
							<Table.Tr>
								<Table.Th w={44}>
									<Checkbox
										checked={allSelected}
										indeterminate={someSelected && !allSelected}
										onChange={() => (allSelected ? deselectAll() : selectAll())}
										aria-label="Select all"
									/>
								</Table.Th>
								<Table.Th>Document name</Table.Th>
								<Table.Th w={100}>Word count</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{scripts.map((script) => (
								<Table.Tr key={script.id}>
									<Table.Td>
										<Checkbox
											checked={selectedScriptIds.has(script.id)}
											onChange={() => toggleScript(script.id)}
											aria-label={`Select ${script.name}`}
										/>
									</Table.Td>
									<Table.Td>
										<Text fw={700} size="sm" lineClamp={2}>
											{script.name}
										</Text>
									</Table.Td>
									<Table.Td>{script.overview.wordCount}</Table.Td>
								</Table.Tr>
							))}
						</Table.Tbody>
					</Table>
				</Paper>

				<Box py="sm" px="md" bg="gray.0">
					<Group justify="space-between" align="baseline">
						<Text size="sm" c="dimmed" fw={600} tt="uppercase" lts={0.5}>
							Total billable words
						</Text>
						<Text size="xl" fw={800} lh={1.2}>
							{totalBillableWords}
						</Text>
					</Group>
					<Text size="xs" c="dimmed" mt={4}>
						{scripts.length} document{scripts.length === 1 ? "" : "s"}
					</Text>
				</Box>

				<Button
					mt="md"
					variant="filled"
					onClick={handleOpenAddModal}
					disabled={!someSelected}
				>
					{targetItemId
						? targetItemName
							? `Add to ${targetItemName}`
							: "Add to this item"
						: "Add to Invoice"}
				</Button>
				{someSelected && (
					<Text size="xs" c="dimmed" mt={4}>
						{selectedScriptIds.size} selected · {selectedWords} words
					</Text>
				)}
			</Stack>

			<Modal
				opened={addModalOpened}
				onClose={closeAddModal}
				title={
					targetItemId
						? targetItemName
							? `Add to ${targetItemName}`
							: "Add to this item"
						: "Add to invoice"
				}
				centered
			>
				<Stack gap="md">
					{!targetItemId && hasItems ? (
						<Radio.Group
							value={addMode}
							onChange={(v) => setAddMode(v as AddToMode)}
							label="Add to"
						>
							<Stack gap="xs">
								<Radio value="existing" label="Existing invoice item" />
								<Radio value="new" label="New invoice item" />
							</Stack>
						</Radio.Group>
					) : !targetItemId && !hasItems ? (
						<Text size="sm" c="dimmed">
							No invoice items yet. Create a new item for the selected scripts.
						</Text>
					) : null}

					{!targetItemId && addMode === "existing" && hasItems && (
						<Select
							label="Invoice item"
							value={selectedItemId}
							onChange={(v) => {
								setSelectedItemId(v);
								setAddError(null);
							}}
							data={invoice.items.map((item) => ({
								value: item.id,
								label: item.name,
							}))}
							placeholder="Select item"
						/>
					)}

					{!targetItemId && addMode === "new" && (
						<TextInput
							label="New item name"
							placeholder="e.g. Episode 1"
							value={newItemName}
							onChange={(e) => setNewItemName(e.currentTarget.value)}
						/>
					)}

					<Select
						label="Use preset"
						placeholder="None"
						clearable
						data={presetOptions}
						value={selectedPresetId}
						onChange={(id) => {
							setSelectedPresetId(id);
							const preset = id ? getPresetById(id) : null;
							if (preset) {
								setSubitemLabel(preset.subitemLabel);
								setRateAmount(preset.rateAmount);
								setRatePerWords(preset.ratePerWords);
							}
						}}
					/>

					<TextInput
						label="Subitem label"
						description="Label for this line (all selected documents become one subitem)"
						placeholder="e.g. Episode 1 Dialogue"
						value={subitemLabel}
						onChange={(e) => {
							setSubitemLabel(e.currentTarget.value);
							setSelectedPresetId(null);
						}}
						required
					/>

					{selectedPreset ? (
						<Text size="sm" c="dimmed">
							Rate: {selectedPreset.rateAmount} per{" "}
							{selectedPreset.ratePerWords} words
						</Text>
					) : (
						<>
							<Box>
								<Text size="sm" fw={500} mb={4} component="label">
									Rate (optional)
								</Text>
								<Text size="xs" c="dimmed" mb="xs">
									e.g. 6 per 100 words. Default: {defaultRatePerWord} per word.
								</Text>
								<Group gap="xs" align="flex-end">
									<NumberInput
										placeholder="0"
										value={rateAmount}
										onChange={(v) => {
											setRateAmount(v === "" ? "" : Number(v));
											setSelectedPresetId(null);
										}}
										min={0}
										decimalScale={2}
										step={0.5}
										style={numberInputFlexStyle}
									/>
									<Text size="sm" c="dimmed">
										per
									</Text>
									<NumberInput
										placeholder="100"
										value={ratePerWords}
										onChange={(v) => {
											setRatePerWords(v === "" ? "" : Number(v));
											setSelectedPresetId(null);
										}}
										min={1}
										step={1}
										style={numberInputWidthStyle}
									/>
									<Text size="sm" c="dimmed">
										words
									</Text>
								</Group>
							</Box>

							{subitemLabel.trim() &&
								rateAmount !== "" &&
								Number(rateAmount) >= 0 &&
								ratePerWords !== "" &&
								Number(ratePerWords) > 0 && (
									<Button
										variant="light"
										size="xs"
										leftSection={<IconBookmark size={14} />}
										onClick={() => {
											const created = addPreset({
												subitemLabel: subitemLabel.trim(),
												rateAmount: Number(rateAmount),
												ratePerWords: Number(ratePerWords),
											});
											setSelectedPresetId(created.id);
										}}
									>
										Save as preset
									</Button>
								)}
						</>
					)}

					{addError && (
						<Text size="sm" c="red">
							{addError}
						</Text>
					)}

					<Group justify="flex-end" mt="md">
						<Button variant="default" onClick={closeAddModal}>
							Cancel
						</Button>
						<Button
							variant="filled"
							onClick={handleAddToInvoice}
							disabled={
								!subitemLabel.trim() ||
								(targetItemId
									? false
									: addMode === "existing"
										? !selectedItemId
										: !newItemName.trim())
							}
						>
							{targetItemId
								? targetItemName
									? `Add to ${targetItemName}`
									: "Add to this item"
								: "Add to invoice"}
						</Button>
					</Group>
				</Stack>
			</Modal>
		</>
	);
}

export const UploadDocumentsOverview = memo(UploadDocumentsOverviewInner);
