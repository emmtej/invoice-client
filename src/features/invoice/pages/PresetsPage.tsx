import { Box, Stack, Tabs, Text } from "@mantine/core";
import { useEffect } from "react";
import { PageTitle } from "@/components/ui/text/PageTitle";
import { BillingRatePresetsManager } from "../components/presets/BillingRatePresetsManager";
import { InvoiceProfilePresetsManager } from "../components/presets/InvoiceProfilePresetsManager";
import { InvoiceTitlePresetsManager } from "../components/presets/InvoiceTitlePresetsManager";
import { useInvoicePresetsStore } from "../store/invoicePresetsStore";

export function PresetsPage() {
	const migrate = useInvoicePresetsStore((s) => s._migrateFromOldStorage);

	useEffect(() => {
		migrate();
	}, [migrate]);

	return (
		<Stack gap="xl">
			<Box>
				<PageTitle>Invoice Presets</PageTitle>
				<Text c="dimmed">
					Manage your billing rates, invoice profiles, and common titles for
					faster invoicing.
				</Text>
			</Box>

			<Tabs defaultValue="rates" variant="outline" radius="md" color="studio-blue">
				<Tabs.List>
					<Tabs.Tab value="rates">Billing Rates</Tabs.Tab>
					<Tabs.Tab value="profiles">Invoice Profiles</Tabs.Tab>
					<Tabs.Tab value="titles">Invoice Titles</Tabs.Tab>
				</Tabs.List>

				<Tabs.Panel value="rates" pt="xl">
					<BillingRatePresetsManager />
				</Tabs.Panel>

				<Tabs.Panel value="profiles" pt="xl">
					<InvoiceProfilePresetsManager />
				</Tabs.Panel>

				<Tabs.Panel value="titles" pt="xl">
					<InvoiceTitlePresetsManager />
				</Tabs.Panel>
			</Tabs>
		</Stack>
	);
}

export default PresetsPage;
