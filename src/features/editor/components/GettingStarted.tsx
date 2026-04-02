import {
	Box,
	Button,
	FileButton,
	Flex,
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
				gap="xl"
				p={32}
				className="flex-1 overflow-hidden max-w-[1000px] mx-auto w-full"
			>
				{/* Top Header */}
				<Group gap={28} align="center" wrap="nowrap">
					<Box className="p-4 rounded-2xl bg-studio-50 text-studio-600 shadow-sm shrink-0 border border-studio-100">
						<FileText size={42} strokeWidth={1.5} />
					</Box>
					<Stack gap={4}>
						<Title
							order={1}
							fw={800}
							lts={-0.8}
							className="text-slate-900 text-3xl"
						>
							Script Editor
						</Title>
						<Text c="dimmed" size="md" className="leading-relaxed font-medium">
							Upload documents or paste script content to calculate
							<span className="text-studio-600 font-bold mx-1">
								billable dialogue word counts
							</span>
							for your invoices.
						</Text>
					</Stack>
				</Group>

				{/* Unified Workflow Area */}
				<Stack gap="lg" className="flex-1 min-h-0">
					{/* Action Bar: Quick Upload */}
					<Paper
						withBorder
						p={20}
						radius="2xl"
						className="bg-slate-50/50 border-dashed border-studio-200 hover:border-studio-400 transition-colors group cursor-pointer"
					>
						<Group justify="space-between" align="center">
							<Group gap="md">
								<Box className="p-2.5 rounded-xl bg-studio-50 text-studio-500 group-hover:bg-studio-100 transition-colors">
									<CloudUpload size={22} />
								</Box>
								<Box>
									<Text fw={700} size="sm" className="text-slate-800">
										Upload Word Documents
									</Text>
									<Text size="xs" c="dimmed" fw={500}>
										Import multiple .docx files to parse them simultaneously
									</Text>
								</Box>
							</Group>
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
										size="md"
										radius="lg"
										className="shadow-md shadow-studio-100 px-6"
									>
										Choose Files
									</Button>
								)}
							</FileButton>
						</Group>
					</Paper>

					{/* Editor Section: Quick Paste */}
					<Box className="flex-1 flex flex-col min-h-0 mt-2">
						<Box className="mb-2 px-1">
							<Text size="xs" fw={800} c="dimmed" tt="uppercase" lts={1}>
								Quick Paste Draft
							</Text>
						</Box>
						<Paper
							withBorder
							radius="2xl"
							className="flex-1 overflow-hidden flex flex-col bg-white shadow-sm hover:shadow-md transition-shadow"
						>
							<TextEditor
								content={pastedContent}
								onContentChange={setPastedContent}
								placeholder="Simply paste your script here (Command+V) to analyze it instantly..."
								additionalMenu={
									<Flex gap="xs" align="center">
										{pastedContent.trim() && (
											<Button
												variant="filled"
												size="xs"
												color="studio"
												leftSection={<Plus size={14} />}
												onClick={handleCreateFromPaste}
												radius="sm"
												className="shadow-sm"
											>
												Process Paste
											</Button>
										)}
									</Flex>
								}
							/>
						</Paper>
					</Box>

					{/* Helpful Tip Section */}
					<Box className="px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 mt-2">
						<Group gap="sm" wrap="nowrap">
							<Box className="p-1 rounded bg-slate-200 text-slate-500 shrink-0">
								<Plus size={12} strokeWidth={3} />
							</Box>
							<Text size="xs" fw={600} className="text-slate-500">
								Tip: Scripts are parsed for dialogue lines only. Action lines
								and scene markers are identified but not billed.
							</Text>
						</Group>
					</Box>
				</Stack>
			</Stack>
		</Box>
	);
}
