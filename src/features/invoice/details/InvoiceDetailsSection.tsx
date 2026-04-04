import { Group, Stack, TextInput } from "@mantine/core";
import { Calendar } from "lucide-react";
import { SurfaceCard } from "@/components/ui/card/SurfaceCard";
import { SectionLabel } from "@/components/ui/text/SectionLabel";

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
	return (
		<SurfaceCard mt="md">
			<Stack gap="sm">
				<SectionLabel>Invoice details</SectionLabel>
				<Group grow align="flex-end">
					<TextInput
						label="Invoice title"
						placeholder="Invoice"
						value={invoiceTitle}
						onChange={(e) => setInvoiceTitle(e.currentTarget.value)}
						size="sm"
					/>
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
