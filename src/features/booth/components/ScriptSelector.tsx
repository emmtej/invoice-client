import {
	Badge,
	Box,
	Button,
	Center,
	Group,
	Loader,
	Paper,
	SimpleGrid,
	Stack,
	Text,
	ThemeIcon,
	UnstyledButton,
} from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { FileText, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { DocxUploadButton } from "@/components/ui/DocxUploadButton";
import { SurfaceCard } from "@/components/ui/SurfaceCard";
import { processDocuments } from "@/features/editor/documentParser";
import { useFileUpload } from "@/features/editor/hooks/useFileUpload";
import {
	scriptKeys,
	useRecentScriptsInfinite,
} from "@/features/scripts/hooks/useScriptsQuery";
import { scriptRepository } from "@/features/storage/scriptRepository";
import type { Script } from "@/types/Script";

interface ScriptSelectorProps {
	onSelect: (script: Script) => void;
	onLoadingChange?: (loading: boolean) => void;
	hideLoader?: boolean;
}

export function ScriptSelector({
	onSelect,
	onLoadingChange,
	hideLoader,
}: ScriptSelectorProps) {
	const queryClient = useQueryClient();
	const [loadingScriptId, setLoadingScriptId] = useState<string | null>(null);

	const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
		useRecentScriptsInfinite();

	const scripts = data?.pages.flatMap((page) => page.scripts) ?? [];

	const {
		isLoading: isUploading,
		errors: uploadErrors,
		handleFileChange,
		reset: resetUpload,
	} = useFileUpload({
		onSuccess: async (docFiles) => {
			const processed = await processDocuments(docFiles);
			if (processed.length > 0) {
				await scriptRepository.saveScripts(processed);
				await queryClient.invalidateQueries({ queryKey: scriptKeys.all });
				if (processed.length === 1) {
					onSelect(processed[0]);
				}
			}
			resetUpload();
		},
	});

	useEffect(() => {
		onLoadingChange?.(isLoading);
	}, [isLoading, onLoadingChange]);

	const handleScriptClick = async (id: string) => {
		setLoadingScriptId(id);
		try {
			const script = await scriptRepository.getScriptById(id);
			if (script) {
				onSelect(script);
				await scriptRepository.touchScript(id);
				await queryClient.invalidateQueries({ queryKey: scriptKeys.all });
			}
		} finally {
			setLoadingScriptId(null);
		}
	};

	const handleLoadMore = () => {
		fetchNextPage();
	};

	if (isLoading && !hideLoader) {
		return (
			<Center py="xl">
				<Loader color="blue" size="sm" />
			</Center>
		);
	}

	if (isLoading) {
		return null;
	}

	return (
		<Stack gap={48}>
			<Group justify="space-between" align="center">
				<Box>
					<Text fw={800} size="xl" c="dimmed" lts={-0.2}>
						Select a Script
					</Text>
					<Text size="sm" c="dimmed" mt={2} fw={500}>
						Choose from your library or import a new document to begin.
					</Text>
				</Box>
				<DocxUploadButton
					onChange={handleFileChange}
					multiple={true}
					variant="filled"
					color="blue"
					size="md"
					loading={isUploading}
					leftSection={<Upload size={18} />}
					className="shadow-md px-8"
				>
					Import DOCX
				</DocxUploadButton>
			</Group>

			{uploadErrors.length > 0 && (
				<Box>
					{uploadErrors.map((err) => (
						<Text key={err} size="sm" c="red">
							{err}
						</Text>
					))}
				</Box>
			)}

			{scripts.length === 0 ? (
				<Paper
					withBorder
					p="xl"
					bg="white"
					style={{
						borderStyle: "dashed",
						borderWidth: 2,
						borderColor: "var(--mantine-color-gray-3)",
					}}
				>
					<Stack align="center" gap="lg" py="xl">
						<ThemeIcon size={64} radius="xl" variant="light" color="gray">
							<FileText size={32} strokeWidth={1.5} />
						</ThemeIcon>
						<Stack gap={4} align="center">
							<Text fw={800} size="lg" c="dimmed">
								Your script library is empty
							</Text>
							<Text size="sm" c="dimmed" ta="center" maw={400}>
								Upload a Word document to automatically extract dialogue lines
								and start your first recording session.
							</Text>
						</Stack>
						<DocxUploadButton
							onChange={handleFileChange}
							multiple={true}
							size="md"
							variant="light"
							color="blue"
							loading={isUploading}
							leftSection={<Upload size={16} />}
						>
							Upload your first script
						</DocxUploadButton>
					</Stack>
				</Paper>
			) : (
				<Stack gap={24}>
					<SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
						{scripts.map((s) => (
							<UnstyledButton
								key={s.id}
								onClick={() => handleScriptClick(s.id)}
								disabled={loadingScriptId !== null}
								className="group"
							>
								<SurfaceCard
									p="lg"
									style={{
										cursor: "pointer",
										transition: "all 200ms ease",
										backgroundColor: "white",
										border:
											loadingScriptId === s.id
												? "2px solid var(--mantine-color-blue-6)"
												: "1px solid var(--mantine-color-gray-3)",
									}}
									className="group-hover:border-blue-4"
								>
									<Stack gap="md">
										<Group gap="sm" wrap="nowrap">
											<ThemeIcon variant="light" color="gray" size="md">
												<FileText size={18} />
											</ThemeIcon>
											<Text fw={700} size="sm" truncate="end" >
												{s.name}
											</Text>
										</Group>
										<Group justify="space-between" align="center">
											<Badge
												size="sm"
												variant="light"
												color="blue"
												className="font-bold"
											>
												{s.wordCount.toLocaleString()} words
											</Badge>
											{loadingScriptId === s.id ? (
												<Loader size={14} color="blue" />
											) : (
												<Text size="xs" c="dimmed" fw={600} tt="uppercase">
													Select
												</Text>
											)}
										</Group>
									</Stack>
								</SurfaceCard>
							</UnstyledButton>
						))}
					</SimpleGrid>

					{hasNextPage && (
						<Center pt="md">
							<Button
								variant="subtle"
								color="gray"
								onClick={handleLoadMore}
								loading={isFetchingNextPage}
								size="sm"
								fw={700}
							>
								Load more scripts
							</Button>
						</Center>
					)}
				</Stack>
			)}
		</Stack>
	);
}
