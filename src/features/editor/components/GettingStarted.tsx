import { Box, Button, Flex, Group, Paper, Stack, Text } from "@mantine/core";
import { FileUp, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { DocxUploadButton } from "@/components/ui/button/DocxUploadButton";
import { TextEditor } from "./TextEditor";

interface GettingStartedProps {
	onFileChange: (files: File[]) => void;
	onPasteProcessed: (html: string) => void;
}

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
			className="fade-up"
		>
			<Stack
				gap={48}
				px={48}
				py={32}
				flex={1}
				className="overflow-y-auto w-full"
			>
				{/* Top: Horizontal Upload Banner */}
				<Box>
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
										backgroundColor: "var(--mantine-color-terracotta-1)",
										borderRadius: "8px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<FileUp
										size={20}
										strokeWidth={2}
										className="text-forest-900"
									/>
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
				</Box>

				{/* Bottom: Paste Editor (Stationery) */}
				<Box style={{ flex: 1, display: "flex", flexDirection: "column" }}>
					<Stack gap="xs" flex={1}>
						<Text size="xs" fw={700} tt="uppercase" lts={2} c="brand-dark.5">
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
				</Box>
			</Stack>
		</Flex>
	);
}
