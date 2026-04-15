import { Combobox, Group, Stack, TextInput, useCombobox } from "@mantine/core";
import { Calendar } from "lucide-react";
import { SurfaceCard } from "@/components/ui/card/SurfaceCard";
import { SectionLabel } from "@/components/ui/text/SectionLabel";
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
		<SurfaceCard mt="md">
			<Stack gap="sm">
				<SectionLabel>Invoice details</SectionLabel>
				<Group grow align="flex-end">
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
								label="Invoice title"
								placeholder="Invoice"
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
								size="sm"
							/>
						</Combobox.Target>

						{options.length > 0 && (
							<Combobox.Dropdown>
								<Combobox.Options>{options}</Combobox.Options>
							</Combobox.Dropdown>
						)}
					</Combobox>

					<TextInput
						label="Invoice date"
						type="date"
						value={invoiceDate}
						onChange={(e) => setInvoiceDate(e.currentTarget.value)}
						leftSection={<Calendar size={14} strokeWidth={1.5} />}
						size="sm"
					/>
				</Group>
			</Stack>
		</SurfaceCard>
	);
}
