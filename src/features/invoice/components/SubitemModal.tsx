import { Button, Group, Select, Stack } from "@mantine/core";
import { useMemo, useState } from "react";
import { AppModal } from "@/components/ui/modal/AppModal";
import { useFileUpload } from "@/features/editor/hooks/useFileUpload";
import { processDocuments } from "@/features/editor/utils/documentParser";
import { useAllScripts } from "@/features/scripts/hooks/useScriptsQuery";
import { useSubitemPresets } from "../presets/useSubitemPresets";
import { type ScriptForInvoice, useInvoiceStore } from "../store/invoiceStore";
import { SubitemBillingForm } from "./SubitemBillingForm";
import { SubitemSourceSelector } from "./SubitemSourceSelector";

interface SubitemModalProps {
	opened: boolean;
	onClose: () => void;
	itemId: string;
	itemName: string;
}

export function SubitemModal({
	opened,
	onClose,
	itemId,
	itemName,
}: SubitemModalProps) {
	const { presetOptions, addPreset, getPresetById } = useSubitemPresets();
	const addSubitemsToItem = useInvoiceStore((s) => s.addSubitemsToItem);

	// State for form
	const [activeTab, setActiveTab] = useState<"upload" | "library">("upload");
	const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
	const [subitemLabel, setSubitemLabel] = useState("");
	const [billingType, setBillingType] = useState<"word-count" | "fixed-rate">(
		"word-count",
	);
	const [rate, setRate] = useState<number>(0.1);
	const [perWords, setPerWords] = useState<number>(1);
	const [fixedAmount, setFixedAmount] = useState<number>(0);
	const [saveAsPreset, setSaveAsPreset] = useState(false);

	// Scripts from library
	const { data: scriptsData } = useAllScripts();
	const libraryScripts = useMemo(() => {
		return (scriptsData ?? []).map(
			(s: { id: string; name: string; wordCount: number }) => ({
				id: s.id,
				name: s.name,
				overview: { wordCount: s.wordCount },
			}),
		);
	}, [scriptsData]);

	const [selectedLibraryScriptIds, setSelectedLibraryScriptIds] = useState<
		string[]
	>([]);

	// Uploaded scripts
	const [uploadedScripts, setUploadedScripts] = useState<ScriptForInvoice[]>(
		[],
	);
	const { handleFileChange, reset: resetUpload } = useFileUpload({
		onSuccess: async (docFiles) => {
			const processed = await processDocuments(docFiles);
			const newScripts: ScriptForInvoice[] = processed.map((p) => ({
				id: p.id,
				name: p.name,
				overview: { wordCount: p.overview.wordCount },
			}));
			setUploadedScripts((prev) => [...prev, ...newScripts]);
			resetUpload();
		},
	});

	// Handle preset selection
	const handlePresetChange = (id: string | null) => {
		setSelectedPresetId(id);
		if (id) {
			const preset = getPresetById(id);
			if (preset) {
				setSubitemLabel(preset.subitemLabel);
				setRate(preset.rateAmount);
				setPerWords(preset.ratePerWords);
				setBillingType("word-count");
			}
		}
	};

	// Calculate total word count of selected/uploaded scripts
	const currentScripts =
		activeTab === "library"
			? libraryScripts.filter((s: ScriptForInvoice) =>
					selectedLibraryScriptIds.includes(s.id),
				)
			: uploadedScripts;

	const totalWordCount = currentScripts.reduce(
		(sum: number, s: ScriptForInvoice) => sum + s.overview.wordCount,
		0,
	);

	const handleAdd = () => {
		const scriptIds = currentScripts.map((s: ScriptForInvoice) => s.id);

		let finalRate = rate;
		let finalPerWords = perWords;

		if (billingType === "fixed-rate") {
			finalRate = fixedAmount;
			finalPerWords = Math.max(1, totalWordCount);
		}

		addSubitemsToItem(
			scriptIds,
			itemId,
			currentScripts,
			subitemLabel,
			finalRate,
			finalPerWords,
		);

		if (saveAsPreset) {
			addPreset({
				subitemLabel,
				rateAmount: finalRate,
				ratePerWords: finalPerWords,
			});
		}

		onClose();
		// Reset local state
		setSubitemLabel("");
		setSelectedLibraryScriptIds([]);
		setUploadedScripts([]);
		setSaveAsPreset(false);
	};

	return (
		<AppModal
			opened={opened}
			onClose={onClose}
			title={`Add Sub-item to ${itemName}`}
			size="md"
		>
			<Stack gap="md">
				<Select
					label="Quick Presets"
					placeholder="Select a billing preset"
					data={presetOptions}
					value={selectedPresetId}
					onChange={handlePresetChange}
					searchable
					clearable
				/>

				<SubitemSourceSelector
					activeTab={activeTab}
					onTabChange={setActiveTab}
					onFileUpload={handleFileChange}
					uploadedScripts={uploadedScripts}
					libraryScripts={libraryScripts}
					selectedLibraryScriptIds={selectedLibraryScriptIds}
					onLibrarySelectionChange={setSelectedLibraryScriptIds}
				/>

				<SubitemBillingForm
					subitemLabel={subitemLabel}
					onLabelChange={setSubitemLabel}
					billingType={billingType}
					onBillingTypeChange={setBillingType}
					rate={rate}
					onRateChange={setRate}
					perWords={perWords}
					onPerWordsChange={setPerWords}
					fixedAmount={fixedAmount}
					onFixedAmountChange={setFixedAmount}
					saveAsPreset={saveAsPreset}
					onSaveAsPresetChange={setSaveAsPreset}
				/>

				<Group justify="flex-end" mt="xl">
					<Button variant="subtle" color="gray" onClick={onClose}>
						Cancel
					</Button>
					<Button
						color="blue"
						onClick={handleAdd}
						disabled={!subitemLabel || currentScripts.length === 0}
					>
						Add to Invoice
					</Button>
				</Group>
			</Stack>
		</AppModal>
	);
}
