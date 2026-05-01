import {
	Button,
	Checkbox,
	Group,
	MultiSelect,
	NumberInput,
	SegmentedControl,
	Select,
	Stack,
	Tabs,
	Text,
	TextInput,
} from "@mantine/core";
import { FileUp, Library } from "lucide-react";
import { useMemo, useState } from "react";
import { DocxUploadButton } from "@/components/ui/button/DocxUploadButton";
import { AppModal } from "@/components/ui/modal/AppModal";
import { useFileUpload } from "@/features/editor/hooks/useFileUpload";
import { processDocuments } from "@/features/editor/utils/documentParser";
import { useAllScripts } from "@/features/scripts/hooks/useScriptsQuery";
import { useSubitemPresets } from "../presets/useSubitemPresets";
import { type ScriptForInvoice, useInvoiceStore } from "../store/invoiceStore";

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
		return (scriptsData ?? []).map((s) => ({
			id: s.id,
			name: s.name,
			overview: { wordCount: s.wordCount },
		}));
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
			? libraryScripts.filter((s) => selectedLibraryScriptIds.includes(s.id))
			: uploadedScripts;

	const totalWordCount = currentScripts.reduce(
		(sum, s) => sum + s.overview.wordCount,
		0,
	);

	const handleAdd = () => {
		const scriptIds = currentScripts.map((s) => s.id);

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
				{/* Top Section: Presets */}
				<Select
					label="Quick Presets"
					placeholder="Select a billing preset"
					data={presetOptions}
					value={selectedPresetId}
					onChange={handlePresetChange}
					searchable
					clearable
				/>

				{/* Middle Section: Source Selection */}
				<Tabs
					value={activeTab}
					onChange={(val) => setActiveTab(val as "upload" | "library")}
					color="studio"
				>
					<Tabs.List grow>
						<Tabs.Tab value="upload" leftSection={<FileUp size={16} />}>
							Upload New
						</Tabs.Tab>
						<Tabs.Tab value="library" leftSection={<Library size={16} />}>
							Select from Library
						</Tabs.Tab>
					</Tabs.List>

					<Tabs.Panel value="upload" pt="md">
						<Stack gap="sm">
							<DocxUploadButton onChange={handleFileChange} multiple>
								Upload Script(s)
							</DocxUploadButton>
							{uploadedScripts.length > 0 && (
								<Stack gap={4}>
									<Text size="xs" fw={700} c="dimmed">
										UPLOADED DOCUMENTS:
									</Text>
									{uploadedScripts.map((s) => (
										<Text key={s.id} size="sm">
											• {s.name} ({s.overview.wordCount} words)
										</Text>
									))}
								</Stack>
							)}
						</Stack>
					</Tabs.Panel>

					<Tabs.Panel value="library" pt="md">
						<MultiSelect
							label="Library Scripts"
							placeholder="Search and select scripts"
							data={libraryScripts.map((s) => ({
								value: s.id,
								label: `${s.name} (${s.overview.wordCount} words)`,
							}))}
							value={selectedLibraryScriptIds}
							onChange={setSelectedLibraryScriptIds}
							searchable
							clearable
							nothingFoundMessage="No scripts found"
						/>
					</Tabs.Panel>
				</Tabs>

				{/* Bottom Section: Billing Configuration */}
				<Stack gap="sm" mt="md">
					<TextInput
						label="Sub-item Label"
						placeholder="e.g. Translation, Pickup, etc."
						value={subitemLabel}
						onChange={(e) => setSubitemLabel(e.currentTarget.value)}
						required
					/>

					<SegmentedControl
						value={billingType}
						onChange={(val) =>
							setBillingType(val as "word-count" | "fixed-rate")
						}
						color="studio"
						data={[
							{ label: "Word Count", value: "word-count" },
							{ label: "Fixed Rate", value: "fixed-rate" },
						]}
					/>

					{billingType === "word-count" ? (
						<Group grow>
							<NumberInput
								label="Rate ($)"
								placeholder="0.10"
								value={rate}
								onChange={(v) => setRate(Number(v))}
								decimalScale={4}
								fixedDecimalScale
								prefix="$"
							/>
							<NumberInput
								label="per [X] words"
								placeholder="1"
								value={perWords}
								onChange={(v) => setPerWords(Number(v))}
								min={1}
							/>
						</Group>
					) : (
						<NumberInput
							label="Total Amount ($)"
							placeholder="50.00"
							value={fixedAmount}
							onChange={(v) => setFixedAmount(Number(v))}
							decimalScale={2}
							fixedDecimalScale
							prefix="$"
						/>
					)}

					<Checkbox
						label="Save as Preset"
						checked={saveAsPreset}
						onChange={(e) => setSaveAsPreset(e.currentTarget.checked)}
						color="studio"
					/>
				</Stack>

				<Group justify="flex-end" mt="xl">
					<Button variant="subtle" color="gray" onClick={onClose}>
						Cancel
					</Button>
					<Button
						color="studio"
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
