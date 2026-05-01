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
import { DocxUploadButton } from "@/components/ui/button/DocxUploadButton";
import { SurfaceCard } from "@/components/ui/card/SurfaceCard";
import { processDocuments, useFileUpload } from "@/features/editor";
import {
	scriptKeys,
	useRecentScriptsInfinite,
} from "@/features/scripts/hooks/useScriptsQuery";
import { scriptsQueries } from "@/features/scripts/store/scriptsQueries";
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
				await scriptsQueries.saveScripts(processed);
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
			const script = await scriptsQueries.getScriptById(id);
			if (script) {
				onSelect(script);
				await scriptsQueries.touchScript(id);
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
				<Loader color="wave" size="sm" />
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
					<Text fw={800} size="xl" c="gray.9" lts={-0.2}>
						Select a Script
					</Text>
					<Text size="sm" c="gray.7" mt={2} fw={500}>
						Choose from your library or import a new document to begin.
					</Text>
				</Box>
				<DocxUploadButton
					onChange={handleFileChange}
					multiple={true}
					variant="filled"
					color="studio"
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
						borderColor: "var(--mantine-color-gray-2)",
					}}
				>
					<Stack align="center" gap="lg" py="xl">
						<ThemeIcon size={64} radius="xl" variant="light" color="gray">
							<FileText size={32} strokeWidth={1.5} />
						</ThemeIcon>
						<Stack gap={4} align="center">
							<Text fw={800} size="lg" c="gray.9">
								Your script library is empty
							</Text>
							<Text size="sm" c="gray.7" ta="center" maw={400}>
								Upload a Word document to automatically extract dialogue lines
								and start your first recording session.
							</Text>
						</Stack>
						<DocxUploadButton
							onChange={handleFileChange}
							multiple={true}
							size="md"
							variant="light"
							color="wave"
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
												? "2px solid var(--mantine-color-wave-4)"
												: "1px solid var(--mantine-color-gray-1)",
									}}
									className="group-hover:border-[var(--mantine-color-wave-3)] group-hover:shadow-lg group-hover:-translate-y-1 group-active:scale-[0.98]"
								>
									<Stack gap="md">
										<Group gap="sm" wrap="nowrap">
											<ThemeIcon variant="light" color="gray" size="md">
												<FileText size={18} />
											</ThemeIcon>
											<Text fw={700} size="sm" truncate="end" c="gray.8">
												{s.name}
											</Text>
										</Group>
										<Group justify="space-between" align="center">
											<Badge
												size="sm"
												variant="light"
												color="wave"
												className="font-bold"
											>
												{s.wordCount.toLocaleString()} words
											</Badge>
											{loadingScriptId === s.id ? (
												<Loader size={14} color="wave" />
											) : (
												<Text size="xs" c="gray.4" fw={600} tt="uppercase">
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
