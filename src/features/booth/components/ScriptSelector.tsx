import {
	Badge,
	Box,
	Button,
	Center,
	Group,
	Loader,
	SimpleGrid,
	Stack,
	Text,
	UnstyledButton,
} from "@mantine/core";
import { FileText, Upload } from "lucide-react";
import { useEffect, useState } from "react";
import { DocxUploadButton } from "@/components/ui/button/DocxUploadButton";
import { SurfaceCard } from "@/components/ui/card/SurfaceCard";
import { EmptyState } from "@/components/ui/feedback/EmptyState";
import { processDocuments, useFileUpload } from "@/features/editor";
import { scriptsQueries } from "@/features/scripts/store/scriptsQueries";
import type { ScriptSummary } from "@/features/storage/types";
import type { Script } from "@/types/Script";

const INITIAL_LIMIT = 5;
const LOAD_MORE_BATCH = 10;

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
	const [scripts, setScripts] = useState<ScriptSummary[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loadingScriptId, setLoadingScriptId] = useState<string | null>(null);
	const [offset, setOffset] = useState(INITIAL_LIMIT);
	const [hasMore, setHasMore] = useState(false);
	const [isLoadingMore, setIsLoadingMore] = useState(false);

	const {
		docFiles,
		isLoading: isUploading,
		errors: uploadErrors,
		handleFileChange,
		reset: resetUpload,
	} = useFileUpload();

	useEffect(() => {
		onLoadingChange?.(isLoading);
	}, [isLoading, onLoadingChange]);

	useEffect(() => {
		(async () => {
			try {
				const [initial, total] = await Promise.all([
					scriptsQueries.getRecentScripts(INITIAL_LIMIT, 0),
					scriptsQueries.countAllScripts(),
				]);
				setScripts(initial);
				setHasMore(total > INITIAL_LIMIT);
			} finally {
				setIsLoading(false);
			}
		})();
	}, []);

	useEffect(() => {
		(async () => {
			if (docFiles.length === 0) return;
			const processed = processDocuments(docFiles);
			if (processed.length > 0) {
				for (const script of processed) {
					await scriptsQueries.saveScript(script);
				}
				const [refreshed, total] = await Promise.all([
					scriptsQueries.getRecentScripts(INITIAL_LIMIT, 0),
					scriptsQueries.countAllScripts(),
				]);
				setScripts(refreshed);
				setOffset(INITIAL_LIMIT);
				setHasMore(total > INITIAL_LIMIT);
				if (processed.length === 1) {
					onSelect(processed[0]);
				}
			}
			resetUpload();
		})();
	}, [docFiles, onSelect, resetUpload]);

	const handleScriptClick = async (id: string) => {
		setLoadingScriptId(id);
		try {
			const script = await scriptsQueries.getScriptById(id);
			if (script) {
				onSelect(script);
				scriptsQueries.touchScript(id); // fire-and-forget
			}
		} finally {
			setLoadingScriptId(null);
		}
	};

	const handleLoadMore = async () => {
		setIsLoadingMore(true);
		try {
			const more = await scriptsQueries.getRecentScripts(
				LOAD_MORE_BATCH,
				offset,
			);
			const newOffset = offset + more.length;
			const total = await scriptsQueries.countAllScripts();
			setScripts((prev) => [...prev, ...more]);
			setOffset(newOffset);
			setHasMore(newOffset < total);
		} finally {
			setIsLoadingMore(false);
		}
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
		<Stack gap="lg">
			<Group justify="space-between" align="center">
				<Text fw={700} size="lg" c="gray.8">
					Select a Script
				</Text>
				<DocxUploadButton
					onChange={handleFileChange}
					multiple={true}
					variant="light"
					color="wave"
					loading={isUploading}
					leftSection={<Upload size={16} />}
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
				<EmptyState
					icon={<FileText size={40} />}
					title="No scripts in your library"
					description="Upload a DOCX file to get started, or add scripts via the Scripts page."
				/>
			) : (
				<Stack gap="md">
					<SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
						{scripts.map((s) => (
							<UnstyledButton
								key={s.id}
								onClick={() => handleScriptClick(s.id)}
								disabled={loadingScriptId !== null}
								className="group"
							>
								<SurfaceCard
									style={{
										cursor: "pointer",
										transition: "all 200ms ease",
										border:
											loadingScriptId === s.id
												? "2px solid var(--mantine-color-wave-4)"
												: "1px solid var(--mantine-color-gray-2)",
									}}
									className="group-hover:border-[var(--mantine-color-wave-3)] group-hover:shadow-md group-active:scale-[0.98]"
								>
									<Stack gap="xs">
										<Group gap="xs" wrap="nowrap">
											<FileText
												size={18}
												style={{ flexShrink: 0 }}
												color="var(--mantine-color-gray-5)"
												className="group-hover:text-[var(--mantine-color-wave-5)]"
											/>
											<Text fw={600} size="sm" truncate="end" c="gray.8">
												{s.name}
											</Text>
										</Group>
										<Group justify="space-between" align="center">
											<Badge size="sm" variant="light" color="wave">
												{s.wordCount.toLocaleString()} words
											</Badge>
											{loadingScriptId === s.id && (
												<Loader size={14} color="wave" />
											)}
										</Group>
									</Stack>
								</SurfaceCard>
							</UnstyledButton>
						))}
					</SimpleGrid>

					{hasMore && (
						<Center pt="md">
							<Button
								variant="light"
								color="wave"
								onClick={handleLoadMore}
								loading={isLoadingMore}
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
