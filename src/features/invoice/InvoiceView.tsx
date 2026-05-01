import { Box, Button, Flex, Group, Paper, Stack, Text } from "@mantine/core";
import { FileText } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { PageTitle } from "@/components/ui/text/PageTitle";
import { useInvoiceStore } from "@/features/invoice/store/invoiceStore";
import { notify } from "@/utils/notifications";
import { InvoiceItemCard } from "./components";
import {
	InvoiceDetailsSection,
	loadInvoiceDefaults,
	saveInvoiceDefaults,
} from "./details";
import { InvoiceItemAdder } from "./items";
import { ProfileSection, useProfileManager } from "./profile";
import { InvoiceSummary } from "./summary";

export default function InvoiceView() {
	const { invoice, addEmptyItem } = useInvoiceStore(
		useShallow((s) => ({
			invoice: s.invoice,
			addEmptyItem: s.addEmptyItem,
		})),
	);
	const [newItemName, setNewItemName] = useState<string>("");

	const profileManager = useProfileManager();

	const [invoiceTitle, setInvoiceTitle] = useState<string>(
		() => loadInvoiceDefaults().invoiceTitle,
	);
	const [invoiceDate, setInvoiceDate] = useState<string>(
		() => loadInvoiceDefaults().invoiceDate,
	);

	useEffect(() => {
		saveInvoiceDefaults({ invoiceTitle, invoiceDate });
	}, [invoiceTitle, invoiceDate]);

	const handleAddItem = useCallback(() => {
		const name = newItemName.trim();
		const finalName = name || "New item";
		addEmptyItem(finalName);
		setNewItemName("");
		notify.success({
			message: `Added item: ${finalName}`,
		});
	}, [addEmptyItem, newItemName]);

	const hasItems = invoice.items.length > 0;

	return (
		<Box className="fade-up" style={{ minHeight: "100%" }}>
			<Stack gap={4} mb="xl" className="fade-up stagger-1">
				<Box>
					<PageTitle>
						New <span style={{ fontStyle: "italic" }}>Invoice</span>
					</PageTitle>
				</Box>
				<Box>
					<Text size="lg" className="page-subtitle">
						Create a professional billing document for your voice-over projects.
					</Text>
				</Box>
			</Stack>

			<Flex
				direction={{ base: "column", lg: "row" }}
				gap={64}
				align="flex-start"
				flex={1}
			>
				{/* Left Column: The Form */}
				<Box flex={1} maw={{ lg: 800 }} w="100%">
					<Stack gap={48}>
						{/* Step 1: Profile */}
						<Box className="fade-up stagger-2">
							<Stack gap="xl">
								<Group gap="xs">
									<Text fw={800} size="xl" c="sage.6" opacity={0.5}>
										01
									</Text>
									<Text fw={800} size="xl">
										Sender Profile
									</Text>
								</Group>
								<Paper p="xl">
									<ProfileSection {...profileManager} />
								</Paper>
							</Stack>
						</Box>

						{/* Step 2: Details */}
						<Box className="fade-up stagger-3">
							<Stack gap="xl">
								<Group gap="xs">
									<Text fw={800} size="xl" c="sage.6" opacity={0.5}>
										02
									</Text>
									<Text fw={800} size="xl">
										Invoice Details
									</Text>
								</Group>
								<Paper p="xl">
									<InvoiceDetailsSection
										invoiceTitle={invoiceTitle}
										setInvoiceTitle={setInvoiceTitle}
										invoiceDate={invoiceDate}
										setInvoiceDate={setInvoiceDate}
									/>
								</Paper>
							</Stack>
						</Box>

						{/* Step 3: Line Items */}
						<Box className="fade-up stagger-4">
							<Stack gap="xl">
								<Group gap="xs">
									<Text fw={800} size="xl" c="sage.6" opacity={0.5}>
										03
									</Text>
									<Text fw={800} size="xl">
										Line Items
									</Text>
								</Group>
								<Paper p="xl">
									<Stack gap="xl">
										<InvoiceItemAdder
											newItemName={newItemName}
											setNewItemName={setNewItemName}
											handleAddItem={handleAddItem}
										/>
										<Stack gap="xl">
											{invoice.items.map((item) => (
												<InvoiceItemCard key={item.id} item={item} />
											))}
										</Stack>
									</Stack>
								</Paper>
							</Stack>
						</Box>
					</Stack>
				</Box>

				{/* Right Column: Live Paper Preview */}
				<Box
					flex="0 0 450px"
					visibleFrom="lg"
					style={{
						position: "sticky",
						top: "100px",
						alignSelf: "flex-start",
					}}
					className="fade-up stagger-5"
				>
					<Box>
						<Stack gap="xl">
							<Stack gap="md">
								<Text
									fw={700}
									size="xs"
									c="sage.6"
									tt="uppercase"
									lts={1}
									ta="center"
								>
									Live Preview
								</Text>
								<Box
									bg="white"
									style={{
										boxShadow:
											"0 20px 50px rgba(45, 58, 49, 0.1), 0 10px 20px rgba(45, 58, 49, 0.05), 0 5px 10px rgba(45, 58, 49, 0.02)",
										minHeight: "600px",
										borderRadius: "4px",
									}}
								>
									<InvoiceSummary
										profile={profileManager.activeProfileForSummary}
										invoiceTitle={invoiceTitle}
										invoiceDate={invoiceDate}
										isLivePreview
									/>
								</Box>
							</Stack>

							<Group grow gap="md">
								<Button
									variant="outline"
									color="forest"
									size="lg"
									disabled={!hasItems}
								>
									Full Preview
								</Button>
								<Button
									variant="filled"
									color="forest"
									size="lg"
									leftSection={<FileText size={20} />}
									disabled={!hasItems}
								>
									Export PDF
								</Button>
							</Group>
						</Stack>
					</Box>
				</Box>
			</Flex>
		</Box>
	);
}
