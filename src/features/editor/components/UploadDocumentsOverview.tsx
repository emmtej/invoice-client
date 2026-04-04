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
import { Bookmark, FileText } from "lucide-react";
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
	}, [scripts.map]); // Only reset if IDs change (new upload/deletion), not if HTML/content changes

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

	const totalBillableWords = scripts.reduce(
		(acc, script) => acc + script.overview.wordCount,
		0,
	);
	const selectedWords = scripts
		.filter((s) => selectedScriptIds.has(s.id))
		.reduce((acc, s) => acc + s.overview.wordCount, 0);

	if (scripts.length === 0) {
		return (
			<Paper py="xl" px="md" bg="transparent">
				<Stack gap="md" align="center">
					<Box className="p-3 rounded-full bg-slate-50 text-slate-200">
						<FileText size={32} strokeWidth={1} />
					</Box>
					<Stack gap={4} ta="center">
						<Text fw={700} size="sm" className="text-slate-600">
							No documents analyzed
						</Text>
						<Text size="xs" c="dimmed" maw={200}>
							Analyze your scripts to see dialogue word counts and add them to
							your invoice.
						</Text>
					</Stack>
				</Stack>
			</Paper>
		);
	}

	return (
		<>
			<Stack gap="xl">
				<Stack gap="md">
					<Box className="px-2">
						<Text size="xs" fw={800} c="dimmed" tt="uppercase" lts={2}>
							Selected Documents
						</Text>
					</Box>
					<Paper
						radius="md"
						p={0}
						style={paperOverflowStyle}
						className="bg-transparent"
					>
						<Table
							verticalSpacing="sm"
							horizontalSpacing="md"
							highlightOnHover
							style={tableLayoutStyle}
						>
							<Table.Thead className="bg-slate-50/80">
								<Table.Tr>
									<Table.Th w={48} className="py-4 border-b border-slate-100">
										<Checkbox
											checked={allSelected}
											indeterminate={someSelected && !allSelected}
											onChange={() =>
												allSelected ? deselectAll() : selectAll()
											}
											aria-label="Select all"
											size="xs"
											color="studio"
										/>
									</Table.Th>
									<Table.Th className="py-4 border-b border-slate-100">
										<Text size="xs" fw={800} c="dimmed" tt="uppercase" lts={1}>
											Title
										</Text>
									</Table.Th>
									<Table.Th w={80} className="py-4 border-b border-slate-100">
										<Text
											size="xs"
											fw={800}
											c="dimmed"
											tt="uppercase"
											lts={1}
											ta="right"
										>
											Words
										</Text>
									</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{scripts.map((script) => (
									<Table.Tr
										key={script.id}
										className="transition-colors hover:bg-slate-50/50"
									>
										<Table.Td className="border-b border-slate-50">
											<Checkbox
												checked={selectedScriptIds.has(script.id)}
												onChange={() => toggleScript(script.id)}
												aria-label={`Select ${script.name}`}
												size="xs"
												color="studio"
											/>
										</Table.Td>
										<Table.Td className="border-b border-slate-50">
											<Text
												fw={600}
												size="xs"
												lineClamp={1}
												className="text-slate-700"
											>
												{script.name}
											</Text>
										</Table.Td>
										<Table.Td className="border-b border-slate-50">
											<Text
												size="xs"
												fw={800}
												className="text-slate-900"
												ta="right"
											>
												{script.overview.wordCount}
											</Text>
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					</Paper>
				</Stack>

				<Box className="p-4 rounded-md bg-slate-50 border border-slate-100">
					<Stack gap="xs">
						<Text size="xs" c="slate.6" fw={800} tt="uppercase" lts={2}>
							Total Billable Volume
						</Text>
						<Group align="baseline" gap={4}>
							<Text
								fw={800}
								className="text-2xl text-slate-800 tabular-nums leading-none"
							>
								{totalBillableWords}
							</Text>
							<Text size="sm" fw={700} c="dimmed">
								words
							</Text>
						</Group>
					</Stack>
				</Box>

				<Stack gap="xs">
					<Button
						variant="filled"
						color="studio"
						size="lg"
						onClick={handleOpenAddModal}
						disabled={!someSelected}
						radius="xl"
						className="shadow-xl shadow-studio-100 h-14 hover:scale-[1.02] transition-transform"
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
							c="dimmed"
							ta="center"
							fw={700}
							tt="uppercase"
							lts={1}
							className="mt-1"
						>
							{selectedScriptIds.size} Selected ·{" "}
							<span className="text-studio-600 font-black">
								{selectedWords} words
							</span>
						</Text>
					)}
				</Stack>
			</Stack>

			<Modal
				opened={addModalOpened}
				onClose={closeAddModal}
				title={
					<Text fw={800} lts={-0.5}>
						{targetItemId
							? targetItemName
								? `Add to ${targetItemName}`
								: "Add to this item"
							: "Add to invoice"}
					</Text>
				}
				centered
				radius="lg"
				withinPortal
				overlayProps={{
					blur: 3,
					backgroundOpacity: 0.55,
				}}
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
									color="studio"
								/>
								<Radio value="new" label="New invoice item" color="studio" />
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
							radius="md"
						/>
					)}

					{!targetItemId && addMode === "new" && (
						<TextInput
							label="New item name"
							placeholder="e.g. Episode 1"
							value={newItemName}
							onChange={(e) => setNewItemName(e.currentTarget.value)}
							radius="md"
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
						radius="md"
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
						radius="md"
					/>

					{selectedPreset ? (
						<Box className="p-3 rounded-lg bg-slate-50 border border-slate-100">
							<Text size="xs" fw={700} c="dimmed" tt="uppercase" mb={4}>
								Applied Rate
							</Text>
							<Text size="sm" fw={600} className="text-slate-800">
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
										radius="md"
									/>
									<Text size="sm" c="dimmed" fw={600}>
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
										radius="md"
									/>
									<Text size="sm" c="dimmed" fw={600}>
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
										color="studio"
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
										radius="md"
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
							radius="md"
						>
							Cancel
						</Button>
						<Button
							variant="filled"
							color="studio"
							onClick={handleAddToInvoice}
							disabled={
								!subitemLabel.trim() ||
								(targetItemId
									? false
									: addMode === "existing"
										? !selectedItemId
										: !newItemName.trim())
							}
							radius="md"
							className="shadow-sm shadow-studio-100"
						>
							{targetItemId ? "Add to Item" : "Confirm & Add"}
						</Button>
					</Group>
				</Stack>
			</Modal>
		</>
	);
}

export const UploadDocumentsOverview = memo(UploadDocumentsOverviewInner);
