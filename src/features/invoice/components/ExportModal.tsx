import { Button, Group, Stack, Text } from "@mantine/core";
import { useClipboard } from "@mantine/hooks";
import { Copy, FileDown } from "lucide-react";
import { AppModal } from "@/components/ui/modal/AppModal";
import type { InvoiceItem } from "../store/invoiceStore";

type ExportModalProps = {
	opened: boolean;
	onClose: () => void;
	items: InvoiceItem[];
	onDownloadPDF: () => void;
};

export const ExportModal = ({
	opened,
	onClose,
	items,
	onDownloadPDF,
}: ExportModalProps) => {
	const clipboard = useClipboard({ timeout: 2000 });

	const handleCopyAsText = () => {
		const text = items
			.map((item) => {
				const itemTotal = item.subitems.reduce(
					(sum, sub) => sum + sub.amount,
					0,
				);
				const subitemsText = item.subitems
					.map(
						(sub) =>
							`${sub.label || sub.scriptName} - ${sub.wordCount.toLocaleString()} - $${sub.amount.toFixed(2)}`,
					)
					.join("\n");

				return `${item.name}\n${subitemsText}\nCost - $${itemTotal.toFixed(2)}`;
			})
			.join("\n\n");

		clipboard.copy(text);
		setTimeout(onClose, 2100);
	};

	return (
		<AppModal opened={opened} onClose={onClose} title="Export Invoice">
			<Stack gap="md">
				<Text size="sm" c="gray.5">
					Choose how you would like to export your invoice summary.
				</Text>

				<Group grow>
					<Button
						leftSection={<FileDown size={16} />}
						onClick={() => {
							onDownloadPDF();
							onClose();
						}}
						variant="light"
					>
						Download PDF
					</Button>
					<Button
						leftSection={<Copy size={16} />}
						onClick={handleCopyAsText}
						color={clipboard.copied ? "teal" : "wave"}
						variant="light"
					>
						{clipboard.copied ? "Copied!" : "Copy as Text"}
					</Button>
				</Group>
			</Stack>
		</AppModal>
	);
};
