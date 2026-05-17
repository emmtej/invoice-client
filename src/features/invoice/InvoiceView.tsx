import { Box, Button, Flex, Group, Stack, Text } from "@mantine/core";
import { FileText } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { motion } from "framer-motion";
import { useInvoiceStore } from "@/features/invoice/store/invoiceStore";
import { notify } from "@/utils/notifications";
import { BentoCard } from "@/components/ui/card/BentoCard";
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
		<Box className="min-h-[100dvh] pb-12">
			<Stack gap={12} mb={64}>
				<motion.div
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6 }}
				>
					<Text className="text-5xl md:text-7xl font-sans font-semibold tracking-tighter leading-none" c="forest.9">
						New <span className="italic font-serif">Invoice</span>
					</Text>
					<Text className="text-lg md:text-xl text-brand-dark-4 mt-6 max-w-[65ch] leading-relaxed">
						Create a professional billing document for your voice-over projects.
						Everything is saved locally as you type.
					</Text>
				</motion.div>
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
									<Text className="font-mono text-sm uppercase tracking-widest text-forest-9 opacity-40">01</Text>
									<Text className="font-sans font-semibold text-lg tracking-tight">Sender Profile</Text>
								</Group>
								<BentoCard index={1} className="hover:shadow-lg transition-shadow">
									<ProfileSection {...profileManager} />
								</BentoCard>
							</Stack>
						</Box>

						{/* Step 2: Details */}
						<Box>
							<Stack gap="xl">
								<Group gap="xs" className="px-4">
									<Text className="font-mono text-sm uppercase tracking-widest text-forest-9 opacity-40">02</Text>
									<Text className="font-sans font-semibold text-lg tracking-tight">Invoice Details</Text>
								</Group>
								<BentoCard index={2} className="hover:shadow-lg transition-shadow">
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
									<Text className="font-mono text-sm uppercase tracking-widest text-forest-9 opacity-40">03</Text>
									<Text className="font-sans font-semibold text-lg tracking-tight">Line Items</Text>
								</Group>
								<BentoCard index={3} className="hover:shadow-lg transition-shadow">
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
								className="text-[10px] font-mono uppercase tracking-[0.2em] text-brand-dark-4 text-center"
							>
								Live Document Preview
							</Text>
							<motion.div
								initial={{ opacity: 0, scale: 0.98 }}
								animate={{ opacity: 1, scale: 1 }}
								transition={{ delay: 0.4 }}
								className="bg-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] min-h-[640px] rounded-[2px] border border-slate-100"
							>
								<InvoiceSummary
									profile={profileManager.activeProfileForSummary}
									invoiceTitle={invoiceTitle}
									invoiceDate={invoiceDate}
									isLivePreview
								/>
							</motion.div>
						</Stack>

						<Group grow gap="md">
							<Button
								variant="outline"
								color="forest"
								size="lg"
								radius="xl"
								disabled={!hasItems}
								className="h-14 border-slate-200 text-forest-9 hover:bg-slate-50 transition-all active:scale-[0.98]"
							>
								Preview Full
							</Button>
							<Button
								variant="filled"
								color="forest"
								size="lg"
								radius="xl"
								leftSection={<FileText size={20} />}
								disabled={!hasItems}
								className="h-14 bg-forest-9 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
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
