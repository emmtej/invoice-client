import { Box, Flex, Group, Stack, Table, Text, Title } from "@mantine/core";
import { memo } from "react";
import { useShallow } from "zustand/react/shallow";
import { getTodayDateString, type InvoiceProfile } from "../profile";
import { useInvoiceStore } from "../store/invoiceStore";

type InvoiceSummaryProps = {
	profile?: InvoiceProfile;
	invoiceTitle: string;
	invoiceDate: string;
	isLivePreview?: boolean;
};

export const InvoiceSummary = memo(
	({
		profile,
		invoiceTitle,
		invoiceDate,
		isLivePreview,
	}: InvoiceSummaryProps) => {
		const { invoice } = useInvoiceStore(
			useShallow((s) => ({
				invoice: s.invoice,
			})),
		);

		const items = invoice.items;
		const totalAmount = items.reduce((sum, item) => {
			const itemTotal = item.subitems.reduce((s, sub) => s + sub.amount, 0);
			return sum + itemTotal;
		}, 0);

		const padding = isLivePreview ? "xl" : "40px";

		return (
			<Box
				p={padding}
				bg="white"
				className="h-full font-sans"
			>
				<Stack gap={48}>
					{/* Header */}
					<Flex justify="space-between" align="flex-start">
						<Stack gap="xs">
							<Title
								order={1}
								className={`font-display ${isLivePreview ? "text-3xl" : "text-5xl"}`}
							>
								{invoiceTitle || "Invoice"}
							</Title>
							<Text size="sm" fw={600} c="dimmed">
								DATE: {invoiceDate || getTodayDateString()}
							</Text>
						</Stack>
						{profile && (
							<Stack gap={2} align="flex-end">
								<Text fw={700} size="sm" >
									{profile.firstName} {profile.lastName}
								</Text>
								<Text size="xs" c="dimmed">
									{profile.email}
								</Text>
							</Stack>
						)}
					</Flex>

					{/* Line Items Table */}
					<Table
						verticalSpacing="md"
						horizontalSpacing="0"
						className="border-t"
					>
						<Table.Thead>
							<Table.Tr>
								<Table.Th className="text-[10px] font-extrabold uppercase tracking-widest border-b">
									Description
								</Table.Th>
								<Table.Th className="text-[10px] font-extrabold uppercase tracking-widest text-right border-b">
									Qty
								</Table.Th>
								<Table.Th className="text-[10px] font-extrabold uppercase tracking-widest text-right border-b">
									Rate
								</Table.Th>
								<Table.Th className="text-[10px] font-extrabold uppercase tracking-widest text-right border-b">
									Total
								</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>
							{items.map((item) =>
								item.subitems.map((sub) => (
									<Table.Tr
										key={sub.id}
										className="border-b last:border-0"
									>
										<Table.Td>
											<Text size="sm" fw={700} >
												{sub.label || item.name}
											</Text>
											<Text size="xs" c="dimmed" mt={2}>
												{sub.scriptName}
											</Text>
										</Table.Td>
										<Table.Td className="text-right">
											<Text size="sm" fw={600} className="tabular-nums">
												{sub.wordCount.toLocaleString()}
											</Text>
										</Table.Td>
										<Table.Td className="text-right">
											<Text size="sm" fw={600} className="tabular-nums">
												${sub.ratePerWord.toFixed(2)}
											</Text>
										</Table.Td>
										<Table.Td className="text-right">
											<Text
												size="sm"
												fw={800}
												
												className="tabular-nums"
											>
												${sub.amount.toFixed(2)}
											</Text>
										</Table.Td>
									</Table.Tr>
								)),
							)}
							{items.length === 0 && (
								<Table.Tr>
									<Table.Td colSpan={4} py={48}>
										<Text size="sm" c="dimmed" ta="center" className="italic">
											No items added to invoice yet.
										</Text>
									</Table.Td>
								</Table.Tr>
							)}
						</Table.Tbody>
					</Table>

					{/* Totals Section */}
					<Stack gap="xs" align="flex-end" mt="xl">
						<Group gap={48}>
							<Text size="xs" fw={800} c="dimmed" tt="uppercase" lts={1.5}>
								Subtotal
							</Text>
							<Text size="sm" fw={700} className="tabular-nums">
								${totalAmount.toFixed(2)}
							</Text>
						</Group>
						<Box className="h-px w-[150px] my-4" />
						<Group gap={48}>
							<Text size="sm" fw={800} tt="uppercase" lts={1.5}>
								Total Due
							</Text>
							<Text
								size={isLivePreview ? "24px" : "32px"}
								fw={900}
								
								className="tabular-nums tracking-tighter"
							>
								${totalAmount.toFixed(2)}
							</Text>
						</Group>
					</Stack>

					{/* Footer Note */}
					<Box mt={64} className="border-t pt-6">
						<Text size="xs" c="dimmed" fw={500} ta="center" lts={0.5}>
							Thank you for your business. Please remit payment within 30 days.
						</Text>
					</Box>
				</Stack>
			</Box>
		);
	},
);

InvoiceSummary.displayName = "InvoiceSummary";
