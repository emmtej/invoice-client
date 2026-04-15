import {
	Badge,
	Box,
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

interface ScriptSelectorProps {
	onSelect: (script: Script) => void;
}

export function ScriptSelector({ onSelect }: ScriptSelectorProps) {
	const [scripts, setScripts] = useState<ScriptSummary[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [loadingScriptId, setLoadingScriptId] = useState<string | null>(null);

	const {
		docFiles,
		isLoading: isUploading,
		errors: uploadErrors,
		handleFileChange,
		reset: resetUpload,
	} = useFileUpload();

	useEffect(() => {
		(async () => {
			try {
				const all = await scriptsQueries.getAllScripts();
				setScripts(all);
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
				// Save all processed scripts to the database
				for (const script of processed) {
					await scriptsQueries.saveScript(script);
				}

				// Refresh the list of scripts
				const all = await scriptsQueries.getAllScripts();
				setScripts(all);

				// If only one was uploaded, select it automatically
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
			if (script) onSelect(script);
		} finally {
			setLoadingScriptId(null);
		}
	};

	if (isLoading) {
		return (
			<Center py="xl">
				<Loader color="wave" size="sm" />
			</Center>
		);
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
				<SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
					{scripts.map((s) => (
						<UnstyledButton
							key={s.id}
							onClick={() => handleScriptClick(s.id)}
							disabled={loadingScriptId !== null}
						>
							<SurfaceCard
								style={{
									cursor: "pointer",
									transition:
										"transform 150ms ease, box-shadow 150ms ease, border-color 150ms ease",
									border:
										loadingScriptId === s.id
											? "1.5px solid var(--mantine-color-wave-4)"
											: "1px solid #F3F4F6",
								}}
							>
								<Stack gap="xs">
									<Group gap="xs" wrap="nowrap">
										<FileText size={16} style={{ flexShrink: 0 }} />
										<Text fw={600} size="sm" truncate="end" c="gray.8">
											{s.name}
										</Text>
									</Group>
									<Group gap="xs">
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
			)}
		</Stack>
	);
}
