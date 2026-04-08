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
import type { Script, ParsedLine } from "@/types/Script";
import { useScriptStore } from "@/features/editor";

interface PreviewPanelProps {
	script: Script | null;
	isLoading: boolean;
	onClose: () => void;
}

function LinePreview({ line, index }: { line: ParsedLine; index: number }) {
	return (
		<Box
			py={4}
			px="xs"
			style={{ borderBottom: "1px solid var(--mantine-color-gray-1)" }}
		>
			<Flex gap="xs" align="flex-start">
				<Text
					size="xs"
					c="gray.4"
					className="tabular-nums"
					w={24}
					ta="right"
					style={{ flexShrink: 0 }}
				>
					{index + 1}
				</Text>
				<Box flex={1} miw={0}>
					{line.type === "dialogue" ? (
						<>
							<Text size="xs" fw={600} c="gray.7" truncate>
								{line.speakers.join(", ")}
							</Text>
							<Text size="xs" c="gray.6" lineClamp={1}>
								{line.content}
							</Text>
						</>
					) : line.type === "action" ? (
						<Text size="xs" c="gray.5" fs="italic" lineClamp={1}>
							{line.notes?.join(" ") || line.source}
						</Text>
					) : line.type === "invalid" || line.type === "malformed" ? (
						<Flex align="center" gap={4}>
							<AlertCircle
								size={12}
								color="var(--mantine-color-red-5)"
								style={{ flexShrink: 0 }}
							/>
							<Text size="xs" c="red.5" lineClamp={1}>
								{line.type === "malformed"
									? line.message
									: line.source || "Invalid line"}
							</Text>
						</Flex>
					) : (
						<Text size="xs" c="gray.4" lineClamp={1}>
							{line.source}
						</Text>
					)}
				</Box>
			</Flex>
		</Box>
	);
}

export function PreviewPanel({ script, isLoading, onClose }: PreviewPanelProps) {
	const navigate = useNavigate();

	const handleOpenInEditor = () => {
		if (!script) return;
		useScriptStore.getState().addScripts([script]);
		navigate({ to: "/editor" });
	};

	return (
		<Box
			w={380}
			style={{
				borderLeft: "1px solid var(--mantine-color-gray-2)",
				flexShrink: 0,
			}}
			display="flex"
			h="100%"
		>
			<Flex direction="column" h="100%" w="100%">
				{isLoading ? (
					<Center flex={1}>
						<Loader color="wave" size="sm" />
					</Center>
				) : script ? (
					<>
						<Box p="md" style={{ borderBottom: "1px solid var(--mantine-color-gray-1)" }}>
							<Flex justify="space-between" align="flex-start" mb="sm">
								<Text size="md" fw={700} c="gray.8" style={{ flex: 1 }} lineClamp={2}>
									{script.name}
								</Text>
								<ActionIcon
									variant="subtle"
									color="gray"
									size="sm"
									onClick={onClose}
									ml="xs"
								>
									<X size={16} />
								</ActionIcon>
							</Flex>
							<Flex gap="xs" wrap="wrap">
								<Badge variant="light" color="wave" size="sm">
									{script.overview.wordCount.toLocaleString()} words
								</Badge>
								<Badge variant="light" color="gray" size="sm">
									{script.overview.totalLines} lines
								</Badge>
								{script.overview.invalidLines.length > 0 && (
									<Badge variant="light" color="red" size="sm">
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
									<Text size="xs" c="gray.4" ta="center" py="xs">
										… {script.lines.length - 30} more lines
									</Text>
								)}
							</Stack>
						</ScrollArea>

						<Box p="md" style={{ borderTop: "1px solid var(--mantine-color-gray-1)" }}>
							<Button
								color="wave"
								fullWidth
								leftSection={<ExternalLink size={16} />}
								onClick={handleOpenInEditor}
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
