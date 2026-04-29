import {
	Combobox,
	SimpleGrid,
	Stack,
	Text,
	TextInput,
	useCombobox,
} from "@mantine/core";
import { Calendar } from "lucide-react";
import { useInvoicePresetsStore } from "../store/invoicePresetsStore";

interface InvoiceDetailsSectionProps {
	invoiceTitle: string;
	setInvoiceTitle: (value: string) => void;
	invoiceDate: string;
	setInvoiceDate: (value: string) => void;
}

export function InvoiceDetailsSection({
	invoiceTitle,
	setInvoiceTitle,
	invoiceDate,
	setInvoiceDate,
}: InvoiceDetailsSectionProps) {
	const titlePresets = useInvoicePresetsStore((s) => s.titlePresets);
	const combobox = useCombobox({
		onDropdownClose: () => combobox.resetSelectedOption(),
	});

	const options = titlePresets.map((preset) => (
		<Combobox.Option value={preset.title} key={preset.id}>
			{preset.title}
		</Combobox.Option>
	));

	return (
		<Stack gap="xl">
			<Text size="xs" fw={700} c="sage.6" tt="uppercase" lts={1}>
				INVOICE DETAILS
			</Text>
				<SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" maw={800}>
					<Combobox
						store={combobox}
						onOptionSubmit={(val) => {
							setInvoiceTitle(val);
							combobox.closeDropdown();
						}}
						withinPortal={false}
					>
						<Combobox.Target>
							<TextInput
								label="Invoice Title"
								placeholder="e.g. Character Voiceover"
								value={invoiceTitle}
								onChange={(event) => {
									setInvoiceTitle(event.currentTarget.value);
									combobox.openDropdown();
									combobox.updateSelectedOptionIndex();
								}}
								onClick={() => combobox.openDropdown()}
								onFocus={() => combobox.openDropdown()}
								onBlur={() => combobox.closeDropdown()}
								rightSection={<Combobox.Chevron />}
								rightSectionPointerEvents="none"
								size="md"
								styles={(theme) => ({
									label: { color: theme.colors.gray[8], marginBottom: 8 },
									input: { "&::placeholder": { color: theme.colors.gray[4] } },
								})}
							/>
						</Combobox.Target>

						{options.length > 0 && (
							<Combobox.Dropdown>
								<Combobox.Options>{options}</Combobox.Options>
							</Combobox.Dropdown>
						)}
					</Combobox>

					<TextInput
						label="Invoice Date"
						type="date"
						value={invoiceDate}
						onChange={(e) => setInvoiceDate(e.currentTarget.value)}
						leftSection={<Calendar size={18} strokeWidth={1.5} />}
						size="md"
						styles={(theme) => ({
							label: { color: theme.colors.gray[8], marginBottom: 8 },
						})}
					/>
				</SimpleGrid>
		</Stack>
	);
}
