import { Box, Button, Flex, Group, Stack, Text } from "@mantine/core";
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
		<Flex direction="column" gap="xl" mih="100%">
			<Stack gap={4} mb="md">
				<PageTitle>New Invoice</PageTitle>
				<Text size="lg" c="dimmed" className="page-subtitle">
					Create a professional billing document for your voice-over projects.
				</Text>
			</Stack>

			<Flex
				direction={{ base: "column", lg: "row" }}
				gap={48}
				align="flex-start"
				flex={1}
			>
				{/* Left Column: The Form */}
				<Box flex={1} maw={{ lg: 800 }} w="100%">
					<Stack gap={48}>
						{/* Step 1: Profile */}
						<Box>
							<Group gap="xs" mb="lg">
								<Text fw={800} size="xl" c="studio-blue.7" opacity={0.5}>
									01
								</Text>
								<Text fw={800} size="xl">
									Sender Profile
								</Text>
							</Group>
							<ProfileSection {...profileManager} />
						</Box>

						{/* Step 2: Details */}
						<Box>
							<Group gap="xs" mb="lg">
								<Text fw={800} size="xl" c="studio-blue.7" opacity={0.5}>
									02
								</Text>
								<Text fw={800} size="xl">
									Invoice Details
								</Text>
							</Group>
							<InvoiceDetailsSection
								invoiceTitle={invoiceTitle}
								setInvoiceTitle={setInvoiceTitle}
								invoiceDate={invoiceDate}
								setInvoiceDate={setInvoiceDate}
							/>
						</Box>

						{/* Step 3: Line Items */}
						<Box>
							<Group gap="xs" mb="lg">
								<Text fw={800} size="xl" c="studio-blue.7" opacity={0.5}>
									03
								</Text>
								<Text fw={800} size="xl">
									Line Items
								</Text>
							</Group>
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
						</Box>

						<Box pt="xl" mb={100}>
							{/* Large action moved to sidebar for better UX focus */}
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
				>
					<Stack gap="xl">
						<Stack gap="md">
							<Text
								fw={700}
								size="xs"
								c="gray.7"
								tt="uppercase"
								lts={1}
								ta="center"
							>
								Live Preview
							</Text>
							<Box
								bg="white"
								style={{
									boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
									minHeight: "600px",
									borderRadius: "2px",
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
								variant="light"
								color="studio-blue"
								size="lg"
								radius="md"
								fw={800}
								disabled={!hasItems}
							>
								Full Preview
							</Button>
							<Button
								variant="filled"
								color="studio-blue"
								size="lg"
								radius="md"
								leftSection={<FileText size={20} />}
								disabled={!hasItems}
								className="shadow-md"
								fw={800}
							>
								Export PDF
							</Button>
						</Group>
					</Stack>
				</Box>
			</Flex>
		</Flex>
	);
}
