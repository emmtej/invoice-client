import { Box, Button, Flex, Group, Paper, Stack, Text } from "@mantine/core";
import { motion } from "framer-motion";
import { FileUp, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { DocxUploadButton } from "@/components/ui/button/DocxUploadButton";
import { TextEditor } from "./TextEditor";

interface GettingStartedProps {
	onFileChange: (files: File[]) => void;
	onPasteProcessed: (html: string) => void;
}

const itemVariants = {
	hidden: { opacity: 0, y: -20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.8 },
	},
};

const editorVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: { duration: 1 },
	},
};

export function GettingStarted({
	onFileChange,
	onPasteProcessed,
}: GettingStartedProps) {
	const [pastedContent, setPastedContent] = useState("");

	const handleCreateFromPaste = useCallback(() => {
		if (!pastedContent.trim()) return;
		onPasteProcessed(pastedContent);
		setPastedContent("");
	}, [pastedContent, onPasteProcessed]);

	return (
		<Flex
			data-testid="getting-started-view"
			direction="column"
			h="100%"
			bg="transparent"
		>
			<Stack
				gap={48}
				px={48}
				py={32}
				flex={1}
				className="overflow-y-auto w-full"
			>
				{/* Top: Horizontal Upload Banner */}
				<motion.div variants={itemVariants}>
					<Paper
						radius="lg"
						p="sm"
						bg="white"
						style={{
							border: "1px solid var(--mantine-color-sage-2)",
							boxShadow: "0 4px 12px rgba(45, 58, 49, 0.05)",
						}}
					>
						<Group justify="space-between" align="center" px="sm">
							<Group gap="md">
								<Box
									p={8}
									style={{
										backgroundColor: "#DCCFC2", // Soft Clay
										borderRadius: "8px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<FileUp size={20} strokeWidth={2} className="text-forest-900" />
								</Box>
								<Box>
									<Text fw={700} size="sm" c="forest.9">
										Upload Scripts
									</Text>
									<Text size="xs" c="forest.9" opacity={0.7}>
										Analyze .docx files to extract dialogue automatically
									</Text>
								</Box>
							</Group>
							<DocxUploadButton
								onChange={onFileChange}
								multiple
								size="sm"
								variant="filled"
								color="forest"
								style={{ borderRadius: "100px" }}
							>
								Select Files
							</DocxUploadButton>
						</Group>
					</Paper>
				</motion.div>

				{/* Bottom: Paste Editor (Stationery) */}
				<motion.div variants={editorVariants} style={{ flex: 1, display: "flex", flexDirection: "column" }}>
					<Stack gap="xs" flex={1}>
						<Text size="xs" fw={700} tt="uppercase" lts={2} c="sage.6">
							Or Paste Content
						</Text>
						<TextEditor
							content={pastedContent}
							onContentChange={setPastedContent}
							placeholder="Paste your script here (e.g. Speaker: Text) to analyze it instantly..."
							additionalMenu={
								<Flex gap="xs" align="center">
									{pastedContent.trim() && (
										<Button
											variant="filled"
											size="md"
											color="terracotta"
											leftSection={<Plus size={16} />}
											onClick={handleCreateFromPaste}
										>
											Process Script
										</Button>
									)}
								</Flex>
							}
						/>
					</Stack>
				</motion.div>
			</Stack>
		</Flex>
	);
}
