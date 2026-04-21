import { Box, Button, Flex, Group, Stack, Text, Title } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import { ExportModal, InvoiceItemCard } from "../components";
import { getTodayDateString, type InvoiceProfile } from "../profile";
import { useInvoiceStore } from "../store/invoiceStore";

type InvoiceSummaryProps = {
	profile?: InvoiceProfile;
	invoiceTitle: string;
	invoiceDate: string;
};

export const InvoiceSummary = memo(
	({ profile, invoiceTitle, invoiceDate }: InvoiceSummaryProps) => {
		const { invoice } = useInvoiceStore(
			useShallow((s) => ({
				invoice: s.invoice,
			})),
		);
		const [exportModalOpened, { open: openExport, close: closeExport }] =
			useDisclosure(false);

		const items = invoice.items;
		const totalAmount = items.reduce((sum, item) => {
			const itemTotal = item.subitems.reduce((s, sub) => s + sub.amount, 0);
			return sum + itemTotal;
		}, 0);

		return (
			<Box mt="xl">
				<Box p={0}>
					<Stack gap="xl">
						<Flex justify="space-between" align="flex-start">
							<Box>
								<Text
									size="xs"
									fw={600}
									tt="uppercase"
									lts="0.1em"
									c="dimmed"
									mb={4}
								>
									Project Invoice
								</Text>
								<Title
									order={2}
									size="h1"
									className="tracking-tight text-balance"
								>
									{invoiceTitle}
								</Title>
								<Text size="sm" c="dimmed" mt={4}>
									Date: {invoiceDate || getTodayDateString()}
								</Text>
							</Box>
							{profile && (
								<Box style={{ textAlign: "right" }}>
									<Text fw={600} c="gray.8">
										{profile.firstName} {profile.lastName}
									</Text>
									<Text size="sm" c="dimmed">
										{profile.email}
									</Text>
								</Box>
							)}
						</Flex>

						<Stack gap="xl">
							{items.map((item) => (
								<InvoiceItemCard key={item.id} item={item} />
							))}
						</Stack>

						<Box py="xl" mt="xs" style={{ borderTop: "2px solid rgba(0,0,0,0.05)" }}>
							<Group justify="flex-end" gap="xl">
								<Text fw={600} size="lg" c="dimmed" tt="uppercase" lts="0.05em">
									Total Amount
								</Text>
								<Text
									fw={800}
									size="32px"
									c="charcoal"
									className="tabular-nums tracking-tighter"
								>
									${totalAmount.toFixed(2)}
								</Text>
							</Group>
						</Box>

						<Group justify="flex-end" mt="md">
							<Button
								variant="filled"
								color="studio-blue"
								size="md"
								onClick={openExport}
								disabled={items.length === 0}
							>
								Export
							</Button>
						</Group>
					</Stack>
				</Box>

				<ExportModal
					opened={exportModalOpened}
					onClose={closeExport}
					items={items}
					onDownloadPDF={() => window.print()}
				/>
			</Box>
		);
	},
);

InvoiceSummary.displayName = "InvoiceSummary";
