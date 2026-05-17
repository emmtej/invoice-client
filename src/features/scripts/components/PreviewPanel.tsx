import {
	ActionIcon,
	Badge,
	Box,
	Button,
	Center,
	Flex,
	Loader,
	ScrollArea,
	Stack,
	Text,
} from "@mantine/core";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, ExternalLink, X } from "lucide-react";
import { useScriptStore } from "@/features/editor/scriptEditorStore";
import type { ParsedLine, Script } from "@/types/Script";

interface PreviewPanelProps {
	script: Script | null;
	isLoading: boolean;
	onClose: () => void;
}

function LinePreview({ line, index }: { line: ParsedLine; index: number }) {
	return (
		<Box py={4} px="xs" className="border-b last:border-0">
			<Flex gap="xs" align="flex-start">
				<Text
					size="xs"
					c="dimmed"
					className="tabular-nums opacity-50 text-right w-6 flex-shrink-0"
				>
					{index + 1}
				</Text>
				<Box className="flex-1 min-w-0">
					{line.type === "dialogue" ? (
						<>
							<Text size="xs" fw={600} truncate>
								{line.speakers.join(", ")}
							</Text>
							<Text size="xs" c="dimmed" lineClamp={1}>
								{line.content}
							</Text>
						</>
					) : line.type === "action" ? (
						<Text size="xs" c="dimmed" className="italic" lineClamp={1}>
							{line.notes?.join(" ") || line.source}
						</Text>
					) : line.type === "invalid" || line.type === "malformed" ? (
						<Flex align="center" gap={4}>
							<AlertCircle
								size={12}
								className="flex-shrink-0"
							/>
							<Text size="xs" c="red" lineClamp={1}>
								{line.type === "malformed"
									? line.message
									: line.source || "Invalid line"}
							</Text>
						</Flex>
					) : (
						<Text size="xs" c="dimmed" lineClamp={1}>
							{line.source}
						</Text>
					)}
				</Box>
			</Flex>
		</Box>
	);
}

export function PreviewPanel({
	script,
	isLoading,
	onClose,
}: PreviewPanelProps) {
	const navigate = useNavigate();

	const handleOpenInEditor = () => {
		if (!script) return;
		useScriptStore.getState().addScripts([script]);
		void navigate({ to: "/editor" });
	};

	return (
		<Box
			w={{ base: "100%", md: "min(380px, 35vw)" }}
			className="border-l flex-shrink-0 flex h-full"
		>
			<Flex direction="column" h="100%" w="100%">
				{isLoading ? (
					<Center flex={1}>
						<Loader color="blue" size="sm" />
					</Center>
				) : script ? (
					<>
						<Box p="md" className="border-b">
							<Flex justify="space-between" align="flex-start" mb="sm">
								<Text
									size="md"
									fw={700}
									
									className="flex-1"
									lineClamp={2}
								>
									{script.name}
								</Text>
								<ActionIcon
									variant="subtle"
									color="gray"
									size="sm"
									onClick={onClose}
									className="ml-2"
								>
									<X size={16} />
								</ActionIcon>
							</Flex>
							<Flex gap="xs" wrap="wrap">
								<Badge variant="light" color="blue" size="sm" radius="md">
									{script.overview.wordCount.toLocaleString()} words
								</Badge>
								<Badge variant="light" color="gray" size="sm" radius="md">
									{script.overview.totalLines} lines
								</Badge>
								{script.overview.invalidLines.length > 0 && (
									<Badge
										variant="light"
										color="red"
										size="sm"
										radius="md"
									>
										{script.overview.invalidLines.length} invalid
									</Badge>
								)}
							</Flex>
						</Box>

						<ScrollArea flex={1} mx={0}>
							<Stack gap={0}>
								{script.lines.slice(0, 30).map((line, i) => (
									<LinePreview
										key={line.id ?? `line-${i}`}
										line={line}
										index={i}
									/>
								))}
								{script.lines.length > 30 && (
									<Text size="xs" c="dimmed" ta="center" py="xs">
										… {script.lines.length - 30} more lines
									</Text>
								)}
							</Stack>
						</ScrollArea>

						<Box p="md" className="border-t">
							<Button
								color="blue"
								fullWidth
								radius="xl"
								leftSection={<ExternalLink size={16} />}
								onClick={handleOpenInEditor}
								className="shadow-sm"
							>
								Open in Editor
							</Button>
						</Box>
					</>
				) : null}
			</Flex>
		</Box>
	);
}
