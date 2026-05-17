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
		<Box className="fade-up h-full">
			<Stack gap={4} mb="xl" className="fade-up stagger-1">
				<Box>
					<PageTitle>
						New <span className="italic">Invoice</span>
					</PageTitle>
				</Box>
				<Box>
					<Text size="lg" className="page-subtitle" c="brand-dark.4">
						Create a professional billing document for your voice-over projects.
					</Text>
				</Box>
			</Stack>

			<Flex
				direction={{ base: "column", lg: "row" }}
				gap={64}
				align="flex-start"
				className="flex-1"
			>
				{/* Left Column: The Form */}
				<Box className="flex-1 max-w-[800px] w-full">
					<Stack gap={48}>
						{/* Step 1: Profile */}
						<Box className="fade-up stagger-2">
							<Stack gap="xl">
								<Group gap="xs">
									<Text fw={800} size="xl" c="sage.6" className="opacity-50">
										01
									</Text>
									<Text fw={800} size="xl" c="brand-dark.7">
										Sender Profile
									</Text>
								</Group>
								<Paper
									radius="3xl"
									p="xl"
									withBorder
									className="border-gray-100 shadow-sm"
								>
									<ProfileSection {...profileManager} />
								</Paper>
							</Stack>
						</Box>

						{/* Step 2: Details */}
						<Box className="fade-up stagger-3">
							<Stack gap="xl">
								<Group gap="xs">
									<Text fw={800} size="xl" c="sage.6" className="opacity-50">
										02
									</Text>
									<Text fw={800} size="xl" c="brand-dark.7">
										Invoice Details
									</Text>
								</Group>
								<Paper
									radius="3xl"
									p="xl"
									withBorder
									className="border-gray-100 shadow-sm"
								>
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
									<Text fw={800} size="xl" c="sage.6" className="opacity-50">
										03
									</Text>
									<Text fw={800} size="xl" c="brand-dark.7">
										Line Items
									</Text>
								</Group>
								<Paper
									radius="3xl"
									p="xl"
									withBorder
									className="border-gray-100 shadow-sm"
								>
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
				<Box className="flex-[0_0_450px] hidden lg:block sticky top-[100px] self-start fade-up stagger-5">
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
								<Box bg="white" className="shadow-2xl min-h-[600px] rounded-sm">
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
									radius="xl"
									disabled={!hasItems}
									className="transition-transform active:scale-95"
								>
									Full Preview
								</Button>
								<Button
									variant="filled"
									color="forest"
									size="lg"
									radius="xl"
									leftSection={<FileText size={20} />}
									disabled={!hasItems}
									className="shadow-sm transition-transform active:scale-95"
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
