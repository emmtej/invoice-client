import {
	Checkbox,
	Group,
	NumberInput,
	SegmentedControl,
	Stack,
	TextInput,
} from "@mantine/core";

interface SubitemBillingFormProps {
	subitemLabel: string;
	onLabelChange: (val: string) => void;
	billingType: "word-count" | "fixed-rate";
	onBillingTypeChange: (val: "word-count" | "fixed-rate") => void;
	rate: number;
	onRateChange: (val: number) => void;
	perWords: number;
	onPerWordsChange: (val: number) => void;
	fixedAmount: number;
	onFixedAmountChange: (val: number) => void;
	saveAsPreset: boolean;
	onSaveAsPresetChange: (val: boolean) => void;
}

export function SubitemBillingForm({
	subitemLabel,
	onLabelChange,
	billingType,
	onBillingTypeChange,
	rate,
	onRateChange,
	perWords,
	onPerWordsChange,
	fixedAmount,
	onFixedAmountChange,
	saveAsPreset,
	onSaveAsPresetChange,
}: SubitemBillingFormProps) {
	return (
		<Stack gap="sm" mt="md">
			<TextInput
				label="Sub-item Label"
				placeholder="e.g. Translation, Pickup, etc."
				value={subitemLabel}
				onChange={(e) => onLabelChange(e.currentTarget.value)}
				required
			/>

			<SegmentedControl
				value={billingType}
				onChange={(val) =>
					onBillingTypeChange(val as "word-count" | "fixed-rate")
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
						onChange={(v) => onRateChange(Number(v))}
						decimalScale={4}
						fixedDecimalScale
						prefix="$"
					/>
					<NumberInput
						label="per [X] words"
						placeholder="1"
						value={perWords}
						onChange={(v) => onPerWordsChange(Number(v))}
						min={1}
					/>
				</Group>
			) : (
				<NumberInput
					label="Total Amount ($)"
					placeholder="50.00"
					value={fixedAmount}
					onChange={(v) => onFixedAmountChange(Number(v))}
					decimalScale={2}
					fixedDecimalScale
					prefix="$"
				/>
			)}

			<Checkbox
				label="Save as Preset"
				checked={saveAsPreset}
				onChange={(e) => onSaveAsPresetChange(e.currentTarget.checked)}
				color="studio"
			/>
		</Stack>
	);
}
