import {
	Box,
	Button,
	Flex,
	Grid,
	Group,
	Paper,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { CloudUpload, FileText, Plus } from "lucide-react";
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
		<Flex direction="column" h="100%" bg="white">
			<Stack
				gap={48}
				p={48}
				flex={1}
				className="overflow-y-auto max-w-[1100px] mx-auto w-full"
			>
				{/* Premium Top Header */}
				<Group gap={32} align="center" wrap="nowrap">
					<Box
						p="md"
						className="bg-studio-50 text-studio-600 shrink-0 border border-studio-100"
						style={{ borderRadius: "var(--mantine-radius-xl)" }}
					>
						<FileText size={32} strokeWidth={1.5} />
					</Box>
					<Stack gap={8}>
						<Title order={1} fw={800} lts={-1} c="dark.9" fz="h1">
							Script Intelligence
						</Title>
						<Text
							c="dimmed"
							size="md"
							fw={500}
							className="leading-relaxed max-w-[600px]"
						>
							Transform your scripts into precise
							<span className="text-studio-600 font-extrabold mx-1.5 underline decoration-studio-200 underline-offset-4">
								billable word counts
							</span>
							instantly. Upload your documents or start with a quick draft.
						</Text>
					</Stack>
				</Group>

				{/* Dynamic Action Area */}
				<Grid gutter={32}>
					{/* Left: Upload Card */}
					<Grid.Col span={{ base: 12, md: 5 }}>
						<Stack gap="lg">
							<Box px="xs">
								<SectionLabel letterSpacing={2}>Direct Import</SectionLabel>
							</Box>
							<Paper
								withBorder
								p={32}
								radius="lg"
								bg="white"
								className="border-slate-200 hover:border-slate-300 transition-colors group cursor-pointer h-full min-h-[250px] flex flex-col justify-center items-center text-center gap-4"
							>
								<Box
									p="lg"
									bg="white"
									className="text-studio-600 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all"
									style={{ borderRadius: "var(--mantine-radius-xl)" }}
								>
									<CloudUpload size={42} strokeWidth={1.5} />
								</Box>
								<Stack gap={8}>
									<Text fw={900} size="xl" c="dark.7">
										Upload Word Docs
									</Text>
									<Text size="sm" c="dimmed" fw={500} maw={240}>
										Support for multiple .docx files with automatic dialogue
										extraction.
									</Text>
								</Stack>
								<DocxUploadButton
									onChange={onFileChange}
									multiple
									size="lg"
									radius="xl"
									className="shadow-xl shadow-studio-100 px-8"
								>
									Select Documents
								</DocxUploadButton>
							</Paper>
						</Stack>
					</Grid.Col>

					{/* Right: Quick Paste Card */}
					<Grid.Col span={{ base: 12, md: 7 }}>
						<Stack gap="lg" h="100%">
							<Box px="xs">
								<SectionLabel letterSpacing={2}>Smart Draft</SectionLabel>
							</Box>
							<Paper
								withBorder
								radius="lg"
								bg="white"
								flex={1}
								className="overflow-hidden flex flex-col shadow-sm border-slate-200 hover:border-slate-300 transition-colors"
							>
								<TextEditor
									content={pastedContent}
									onContentChange={setPastedContent}
									placeholder="Paste your script text here to analyze it instantly (Dialogue: Speaker: Text)..."
									additionalMenu={
										<Flex gap="xs" align="center">
											{pastedContent.trim() && (
												<Button
													variant="filled"
													size="sm"
													color="studio"
													leftSection={<Plus size={16} />}
													onClick={handleCreateFromPaste}
													radius="md"
													className="shadow-md"
												>
													Process Content
												</Button>
											)}
										</Flex>
									}
								/>
							</Paper>
						</Stack>
					</Grid.Col>
				</Grid>

				{/* Professional Footer Insight */}
				<Box
					p="xl"
					bg="gray.0"
					style={{
						border: "1px solid var(--mantine-color-gray-2)",
						borderRadius: "var(--mantine-radius-xl)",
					}}
				>
					<Group gap={16} wrap="nowrap">
						<Box
							p="xs"
							bg="white"
							className="text-studio-500 shadow-sm shrink-0"
							style={{
								border: "1px solid var(--mantine-color-gray-2)",
								borderRadius: "var(--mantine-radius-md)",
							}}
						>
							<Plus size={16} strokeWidth={3} />
						</Box>
						<Text size="sm" fw={600} c="dark.4" className="leading-relaxed">
							<span className="text-studio-700 font-bold">Pro Tip:</span> Our
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
