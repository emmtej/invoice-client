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
			withBorder
			p="lg"
			radius="md"
			mt="md"
			bg="light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-7))"
		>
			<Stack gap="sm">
				<Text size="sm" fw={600} c="dimmed">
					Invoice details
				</Text>
				<Group grow align="flex-end">
					<TextInput
						label="Invoice title"
						placeholder="Invoice"
						value={invoiceTitle}
						onChange={(e) => setInvoiceTitle(e.currentTarget.value)}
					/>
					<TextInput
						label="Invoice date"
						type="date"
						value={invoiceDate}
						onChange={(e) => setInvoiceDate(e.currentTarget.value)}
						leftSection={<IconCalendar size={16} />}
					/>
				</Group>
			</Stack>
		</Paper>
	);
}
