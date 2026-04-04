import { Group, Paper, Stack, Text, TextInput } from "@mantine/core";
import { IconCalendar } from "@tabler/icons-react";

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
		<Paper
			p="lg"
			radius="md"
			mt="md"
			className="bg-white border border-slate-100"
		>
			<Stack gap="sm">
				<Text size="xs" fw={800} c="dimmed" tt="uppercase" lts={1}>
					Invoice details
				</Text>
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
						leftSection={<IconCalendar size={14} stroke={1.5} />}
						size="sm"
					/>
				</Group>
			</Stack>
		</Paper>
	);
}
