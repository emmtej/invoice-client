import { Box, Button, Flex, Group, Stack, Text } from "@mantine/core";
import { FileText } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { useInvoiceStore } from "@/features/invoice/store";
import { notify } from "@/utils/notifications";
import { BentoCard } from "@/components/ui/BentoCard";
import { InvoiceDetailsSection } from "./components/InvoiceDetailsSection";
import { InvoiceItemAdder } from "./components/InvoiceItemAdder";
import { InvoiceItemCard } from "./components/InvoiceItemCard";
import { InvoiceSummary } from "./components/InvoiceSummary";
import { ProfileSection } from "./components/ProfileSection";
import { loadInvoiceDefaults, saveInvoiceDefaults } from "./constants";
import { useProfileManager } from "./hooks/useProfileManager";

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
		<Box className="min-h-[100dvh] pb-12">
			<Stack gap={12} mb={64}>
				<Text className="text-5xl md:text-7xl font-sans font-semibold tracking-tighter leading-none">
					New <span className="italic font-serif">Invoice</span>
				</Text>
				<Text className="text-lg md:text-xl mt-6 max-w-[65ch] leading-relaxed" c="dimmed">
					Create a professional billing document for your voice-over projects.
					Everything is saved locally as you type.
				</Text>
			</Stack>

			<Flex
				direction={{ base: "column", lg: "row" }}
				gap={64}
				align="flex-start"
			>
				{/* Left Column: The Form */}
				<Box className="flex-1 max-w-[850px] w-full">
					<Stack gap={64}>
						{/* Step 1: Profile */}
						<Box>
							<Stack gap="xl">
								<Group gap="xs" className="px-4">
									<Text className="font-mono text-sm uppercase tracking-widest opacity-40">01</Text>
									<Text className="font-sans font-semibold text-lg tracking-tight">Sender Profile</Text>
								</Group>
								<BentoCard>
									<ProfileSection {...profileManager} />
								</BentoCard>
							</Stack>
						</Box>

						{/* Step 2: Details */}
						<Box>
							<Stack gap="xl">
								<Group gap="xs" className="px-4">
									<Text className="font-mono text-sm uppercase tracking-widest opacity-40">02</Text>
									<Text className="font-sans font-semibold text-lg tracking-tight">Invoice Details</Text>
								</Group>
								<BentoCard>
									<InvoiceDetailsSection
										invoiceTitle={invoiceTitle}
										setInvoiceTitle={setInvoiceTitle}
										invoiceDate={invoiceDate}
										setInvoiceDate={setInvoiceDate}
									/>
								</BentoCard>
							</Stack>
						</Box>

						{/* Step 3: Line Items */}
						<Box>
							<Stack gap="xl">
								<Group gap="xs" className="px-4">
									<Text className="font-mono text-sm uppercase tracking-widest opacity-40">03</Text>
									<Text className="font-sans font-semibold text-lg tracking-tight">Line Items</Text>
								</Group>
								<BentoCard>
									<Stack gap={48}>
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
								</BentoCard>
							</Stack>
						</Box>
					</Stack>
				</Box>

				{/* Right Column: Live Paper Preview */}
				<Box className="flex-[0_0_480px] hidden lg:block sticky top-[100px] self-start">
					<Stack gap={32}>
						<Stack gap="md">
							<Text
								className="text-[10px] font-mono uppercase tracking-[0.2em] text-center"
							>
								Live Document Preview
							</Text>
							<Box className="min-h-[640px] rounded border shadow-sm">
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
								color="blue"
								size="lg"
								radius="xl"
								disabled={!hasItems}
								className="h-14 active:scale-[0.98]"
							>
								Preview Full
							</Button>
							<Button
								variant="filled"
								color="blue"
								size="lg"
								radius="xl"
								leftSection={<FileText size={20} />}
								disabled={!hasItems}
								className="h-14 shadow-lg transition-shadow hover:shadow-xl active:scale-[0.98]"
							>
								Export PDF
							</Button>
						</Group>
					</Stack>
				</Box>
			</Flex>
		</Box>
	);
}
