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
							border: "1px solid var(--mantine-color-gray-5)",
							boxShadow: "var(--mantine-shadow-sm)",
						}}
					>
						<Group justify="space-between" align="center" px="sm">
							<Group gap="md">
								<Box
									p={8}
									style={{
										backgroundColor: "var(--mantine-color-orange-6)",
										borderRadius: "8px",
										display: "flex",
										alignItems: "center",
										justifyContent: "center",
									}}
								>
									<FileUp
										size={20}
										strokeWidth={2}
									/>
								</Box>
								<Box>
									<Text fw={700} size="sm" >
										Upload Scripts
									</Text>
									<Text size="xs"  opacity={0.7}>
										Analyze .docx files to extract dialogue automatically
									</Text>
								</Box>
							</Group>
							<DocxUploadButton
								onChange={onFileChange}
								multiple
								size="sm"
								variant="filled"
								color="blue"
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
						<Text size="xs" fw={700} tt="uppercase" lts={2} c="dimmed">
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
											color="blue"
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
