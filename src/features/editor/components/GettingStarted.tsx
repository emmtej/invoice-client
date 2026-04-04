import {
	Box,
	Button,
	FileButton,
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
		<Box className="flex flex-col h-full bg-white">
			<Stack
				gap={48}
				p={48}
				className="flex-1 overflow-y-auto max-w-[1100px] mx-auto w-full"
			>
				{/* Premium Top Header */}
				<Group gap={32} align="center" wrap="nowrap">
					<Box className="p-4 rounded-2xl bg-studio-50 text-studio-600 shrink-0 border border-studio-100">
						<FileText size={32} strokeWidth={1.5} />
					</Box>
					<Stack gap={8}>
						<Title
							order={1}
							fw={800}
							lts={-1}
							className="text-slate-900 text-3xl"
						>
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
							<Box className="px-2">
								<Text size="xs" fw={800} c="dimmed" tt="uppercase" lts={2}>
									Direct Import
								</Text>
							</Box>
							<Paper
								withBorder
								p={32}
								radius="lg"
								className="bg-white border border-slate-200 hover:border-slate-300 transition-colors group cursor-pointer h-full min-h-[250px] flex flex-col justify-center items-center text-center gap-4"
							>
								<Box className="p-5 rounded-3xl bg-white text-studio-600 shadow-sm group-hover:scale-110 group-hover:shadow-md transition-all">
									<CloudUpload size={42} strokeWidth={1.5} />
								</Box>
								<Stack gap={8}>
									<Text fw={900} size="xl" className="text-slate-800">
										Upload Word Docs
									</Text>
									<Text size="sm" c="dimmed" fw={500} maw={240}>
										Support for multiple .docx files with automatic dialogue
										extraction.
									</Text>
								</Stack>
								<FileButton
									onChange={onFileChange}
									accept="application/vnd.openxmlformats-officedocument.wordprocessingml.document"
									multiple
								>
									{(props) => (
										<Button
											{...props}
											variant="filled"
											color="studio"
											size="lg"
											radius="xl"
											className="shadow-xl shadow-studio-100 px-8"
										>
											Select Documents
										</Button>
									)}
								</FileButton>
							</Paper>
						</Stack>
					</Grid.Col>

					{/* Right: Quick Paste Card */}
					<Grid.Col span={{ base: 12, md: 7 }}>
						<Stack gap="lg" h="100%">
							<Box className="px-2">
								<Text size="xs" fw={800} c="dimmed" tt="uppercase" lts={2}>
									Smart Draft
								</Text>
							</Box>
							<Paper
								withBorder
								radius="lg"
								className="flex-1 overflow-hidden flex flex-col bg-white shadow-sm border border-slate-200 hover:border-slate-300 transition-colors"
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
				<Box className="p-6 rounded-2xl bg-slate-50 border border-slate-100">
					<Group gap={16} wrap="nowrap">
						<Box className="p-2 rounded-xl bg-white text-studio-500 shadow-sm shrink-0 border border-slate-100">
							<Plus size={16} strokeWidth={3} />
						</Box>
						<Text size="sm" fw={600} className="text-slate-600 leading-relaxed">
							<span className="text-studio-700 font-bold">Pro Tip:</span> Our
							parser identifies dialogue, action lines, and scene markers
							automatically. Only dialogue lines contribute to the billable word
							count.
						</Text>
					</Group>
				</Box>
			</Stack>
		</Box>
	);
}
