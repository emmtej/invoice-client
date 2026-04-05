import {
	Box,
	Button,
	Checkbox,
	Group,
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
import { Bookmark, FileText } from "lucide-react";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { AppModal } from "@/components/ui/modal/AppModal";
import { SectionLabel } from "@/components/ui/text/SectionLabel";
import { useSubitemPresets } from "@/features/invoice/presets/useSubitemPresets";
import { useInvoiceStore } from "@/features/invoice/store/invoiceStore";
import type { Script } from "@/types/Script";

const paperOverflowStyle = { overflow: "hidden" as const };
const tableLayoutStyle = { tableLayout: "fixed" as const, width: "100%" };
const borderBottomGray2 = {
	borderBottom: "1px solid var(--mantine-color-gray-2)",
} as const;
const borderBottomGray1 = {
	borderBottom: "1px solid var(--mantine-color-gray-1)",
} as const;
const borderGray2 = {
	border: "1px solid var(--mantine-color-gray-2)",
} as const;
const numberInputFlexStyle = { flex: 1 };
const numberInputWidthStyle = { width: 100 };

interface UploadDocumentsOverviewProps {
	scripts: Script[];
	/** Called after scripts are successfully added to the invoice with the IDs that were added. */
	onAddedToInvoice?: (addedIds: string[]) => void;
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

	const { invoice, addSubitemsToItem, addSubitemsAsNewItem } = useInvoiceStore(
		useShallow((s) => ({
			invoice: s.invoice,
			addSubitemsToItem: s.addSubitemsToItem,
			addSubitemsAsNewItem: s.addSubitemsAsNewItem,
		})),
	);
	const { presetOptions, addPreset, getPresetById } = useSubitemPresets();
	const defaultRatePerWord = invoice.defaultRatePerWord;
	const hasItems = invoice.items.length > 0;
	const selectedPreset = selectedPresetId
		? getPresetById(selectedPresetId)
		: null;

	useEffect(() => {
		setSelectedScriptIds(new Set(scripts.map((s) => s.id)));
	}, [scripts]); // Reset if IDs change or scripts list reference changes

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
			onAddedToInvoice?.(selectedIds);
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
		onAddedToInvoice?.(selectedIds);
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

	const totalBillableWords = useMemo(
		() => scripts.reduce((acc, script) => acc + script.overview.wordCount, 0),
		[scripts],
	);
	const selectedWords = useMemo(
		() =>
			scripts
				.filter((s) => selectedScriptIds.has(s.id))
				.reduce((acc, s) => acc + s.overview.wordCount, 0),
		[scripts, selectedScriptIds],
	);
	if (scripts.length === 0) {
		return (
			<EmptyState
				icon={<FileText size={32} strokeWidth={1} />}
				title="No documents analyzed"
				description="Analyze your scripts to see dialogue word counts and add them to your invoice."
			/>
		);
	}

	return (
		<>
			<Stack gap="xl">
				<Stack gap="md">
					<Box px="xs">
						<SectionLabel letterSpacing={2}>Selected Documents</SectionLabel>
					</Box>
					<Paper p={0} bg="transparent" style={paperOverflowStyle}>
						<Table
							verticalSpacing="sm"
							horizontalSpacing="md"
							highlightOnHover
							style={tableLayoutStyle}
						>
							<Table.Thead bg="gray.0">
								<Table.Tr>
									<Table.Th w={48} py="md" style={borderBottomGray2}>
										<Checkbox
											checked={allSelected}
											indeterminate={someSelected && !allSelected}
											onChange={() =>
												allSelected ? deselectAll() : selectAll()
											}
											aria-label="Select all"
											size="xs"
											color="wave"
										/>
									</Table.Th>
									<Table.Th py="md" style={borderBottomGray2}>
										<SectionLabel>Title</SectionLabel>
									</Table.Th>
									<Table.Th w={80} py="md" style={borderBottomGray2}>
										<SectionLabel ta="right">Words</SectionLabel>
									</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{scripts.map((script) => (
									<Table.Tr
										key={script.id}
										className="transition-colors hover:bg-gray-50/70"
									>
										<Table.Td style={borderBottomGray1}>
											<Checkbox
												checked={selectedScriptIds.has(script.id)}
												onChange={() => toggleScript(script.id)}
												aria-label={`Select ${script.name}`}
												size="xs"
												color="wave"
											/>
										</Table.Td>
										<Table.Td style={borderBottomGray1}>
											<Text fw={600} size="xs" lineClamp={1} c="gray.6">
												{script.name}
											</Text>
										</Table.Td>
										<Table.Td style={borderBottomGray1}>
											<Text size="xs" fw={800} c="gray.8" ta="right">
												{script.overview.wordCount}
											</Text>
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					</Paper>
				</Stack>

				<Box
					p="md"
					bg="gray.0"
					style={borderGray2}
				>
					<Stack gap="xs">
						<SectionLabel letterSpacing={2} c="gray.5">
							Total Billable Volume
						</SectionLabel>
						<Group align="baseline" gap={4}>
							<Text
								fw={800}
								size="xl"
								c="gray.8"
								className="tabular-nums leading-none"
							>
								{totalBillableWords}
							</Text>
							<Text size="sm" fw={600} c="gray.5">
								words
							</Text>
						</Group>
					</Stack>
				</Box>

				<Stack gap="xs">
					<Button
						variant="filled"
						color="wave"
						size="lg"
						onClick={handleOpenAddModal}
						disabled={!someSelected}
						className="shadow-xl shadow-wave-100 h-14 hover:scale-[1.02] transition-transform"
					>
						{targetItemId
							? targetItemName
								? `Add to ${targetItemName}`
								: "Add to this item"
							: "Generate Invoice Items"}
					</Button>
					{someSelected && (
						<Text
							size="xs"
							c="gray.5"
							ta="center"
							fw={600}
							tt="uppercase"
							lts={1}
							mt="xs"
						>
							{selectedScriptIds.size} Selected ·{" "}
							<span className="text-wave-700 font-black">
								{selectedWords} words
							</span>
						</Text>
					)}
				</Stack>
			</Stack>

			<AppModal
				opened={addModalOpened}
				onClose={closeAddModal}
				title={
					targetItemId
						? targetItemName
							? `Add to ${targetItemName}`
							: "Add to this item"
						: "Add to invoice"
				}
			>
				<Stack gap="md">
					{!targetItemId && hasItems ? (
						<Radio.Group
							value={addMode}
							onChange={(v) => setAddMode(v as AddToMode)}
							label="Add to"
						>
							<Stack gap="xs" mt="xs">
								<Radio
									value="existing"
									label="Existing invoice item"
									color="wave"
								/>
								<Radio value="new" label="New invoice item" color="wave" />
							</Stack>
						</Radio.Group>
					) : !targetItemId && !hasItems ? (
						<Text size="sm" c="gray.5">
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
						<Box
							p="sm"
							bg="gray.0"
							style={borderGray2}
						>
							<Text size="xs" fw={600} c="gray.5" tt="uppercase" mb={4}>
								Applied Rate
							</Text>
							<Text size="sm" fw={600} c="gray.8">
								{selectedPreset.rateAmount} per {selectedPreset.ratePerWords}{" "}
								words
							</Text>
						</Box>
					) : (
						<>
							<Box>
								<Text size="sm" fw={600} mb={4} component="label">
									Rate (optional)
								</Text>
								<Text size="xs" c="gray.5" mb="xs">
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
									<Text size="sm" c="gray.5" fw={600}>
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
									<Text size="sm" c="gray.5" fw={600}>
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
										color="wave"
										size="xs"
										leftSection={<Bookmark size={14} />}
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
						<Text size="xs" c="red" fw={600}>
							{addError}
						</Text>
					)}

					<Group justify="flex-end" mt="xl">
						<Button
							variant="subtle"
							color="gray"
							onClick={closeAddModal}
						>
							Cancel
						</Button>
						<Button
							variant="filled"
							color="wave"
							onClick={handleAddToInvoice}
							disabled={
								!subitemLabel.trim() ||
								(targetItemId
									? false
									: addMode === "existing"
										? !selectedItemId
										: !newItemName.trim())
							}
							className="shadow-sm shadow-wave-100"
						>
							{targetItemId ? "Add to Item" : "Confirm & Add"}
						</Button>
					</Group>
				</Stack>
			</AppModal>
		</>
	);
}

export const UploadDocumentsOverview = memo(UploadDocumentsOverviewInner);
