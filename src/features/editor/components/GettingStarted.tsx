import { Box, Button, Flex, Group, Paper, Stack, Text } from "@mantine/core";
import { CloudUpload, Plus } from "lucide-react";
import { useCallback, useState } from "react";
import { DocxUploadButton } from "@/components/ui/button/DocxUploadButton";
import { SectionLabel } from "@/components/ui/text/SectionLabel";
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
			bg="white"
		>
			<Stack
				gap={48}
				px={48}
				py={32}
				flex={1}
				className="overflow-y-auto max-w-[1100px] mx-auto w-full"
			>
				{/* Dynamic Action Area */}
				<Stack gap={32}>
					{/* Upload Documents */}
					<Stack gap="lg">
						<Box px="xs">
							<SectionLabel letterSpacing={2}>Upload Documents</SectionLabel>
						</Box>
						<Paper
							withBorder
							p="md"
							bg="white"
							className="border-gray-200 hover:border-gray-300 transition-colors group"
						>
							<Group justify="space-between" align="center" wrap="nowrap">
								<Group gap="md" wrap="nowrap">
									<Box
										p="sm"
										bg="white"
										className="border border-gray-100 text-wave-700 shadow-sm transition-all group-hover:scale-105"
									>
										<CloudUpload size={24} strokeWidth={1.5} />
									</Box>
									<Stack gap={0}>
										<Text fw={800} size="sm" c="gray.8" lts={-0.2}>
											Word Documents (.docx)
										</Text>
										<Text size="xs" c="gray.5" fw={500}>
											Upload files to automatically extract and count dialogue
											lines.
										</Text>
									</Stack>
								</Group>
								<DocxUploadButton
									onChange={onFileChange}
									multiple
									size="sm"
									className="shadow-sm shadow-wave-100 px-6"
								>
									Select Documents
								</DocxUploadButton>
							</Group>
						</Paper>
					</Stack>
					{/* Paste Script */}
					<Stack gap="lg">
						<Box px="xs">
							<SectionLabel letterSpacing={2}>Paste Script</SectionLabel>
						</Box>
						<Paper
							withBorder
							bg="white"
							mih={400}
							className="overflow-hidden flex flex-col border-gray-200 shadow-sm transition-colors hover:border-gray-300"
						>
							<TextEditor
								content={pastedContent}
								onContentChange={setPastedContent}
								placeholder="Paste your script here (e.g. Speaker: Text) to analyze it instantly..."
								additionalMenu={
									<Flex gap="xs" align="center">
										{pastedContent.trim() && (
											<Button
												variant="filled"
												size="sm"
												color="wave"
												leftSection={<Plus size={16} />}
												onClick={handleCreateFromPaste}
												className="shadow-md"
											>
												Process Script
											</Button>
										)}
									</Flex>
								}
							/>
						</Paper>
					</Stack>
				</Stack>

				{/* Professional Footer Insight */}
				<Box
					p="xl"
					bg="gray.0"
					style={{
						border: "1px solid var(--mantine-color-gray-2)",
					}}
				>
					<Group gap={16} wrap="nowrap">
						<Box
							p="xs"
							bg="white"
							className="text-wave-600 shadow-sm shrink-0"
							style={{
								border: "1px solid var(--mantine-color-gray-2)",
							}}
						>
							<Plus size={16} strokeWidth={3} />
						</Box>
						<Text size="sm" fw={600} c="gray.5" className="leading-relaxed">
							<span className="text-wave-800 font-bold">Pro Tip:</span> Our
							parser identifies dialogue, action lines, and scene markers
							automatically. Only dialogue lines contribute to the billable word
							count.
						</Text>
					</Group>
				</Box>
			</Stack>
		</Flex>
	);
}
