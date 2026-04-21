import {
	ActionIcon,
	Alert,
	Box,
	Breadcrumbs,
	Button,
	Group,
	Text,
	Tooltip,
} from "@mantine/core";
import { AlertCircle, ChevronRight, FolderPlus, Grid, List } from "lucide-react";
import { PageTitle } from "@/components/ui/text/PageTitle";
import { DocxUploadButton } from "@/components/ui/button/DocxUploadButton";

interface ScriptsHeaderProps {
	uploadErrors: string[];
	onResetUpload: () => void;
	viewMode: "list" | "grid";
	onViewModeChange: (mode: "list" | "grid") => void;
	onCreateFolder: () => void;
	onUpload: (files: File[]) => void;
	isUploading: boolean;
}

export function ScriptsHeader({
	uploadErrors,
	onResetUpload,
	viewMode,
	onViewModeChange,
	onCreateFolder,
	onUpload,
	isUploading,
}: ScriptsHeaderProps) {
	return (
		<>
			{/* Breadcrumb orientation bar */}
			<Box
				px="md"
				py="xs"
				style={{
					borderBottom: "1px solid rgba(0,0,0,0.05)",
				}}
			>
				<Breadcrumbs
					separator={
						<ChevronRight
							size={14}
							strokeWidth={2.5}
							className="text-black/10"
						/>
					}
					separatorMargin="md"
				>
					<Text size="xs" fw={800} tt="uppercase" lts={1.5} c="dimmed">
						Script Tools
					</Text>
					<Text size="xs" fw={900} tt="uppercase" lts={1.5} c="charcoal">
						Scripts
					</Text>
				</Breadcrumbs>
			</Box>

			{/* Page header */}
			<Box px="md" pt="md">
				<Group justify="space-between" align="center">
					<PageTitle>Scripts</PageTitle>

					<Group gap="xs">
						<Group gap={0} bg="black/5" p={2} style={{ borderRadius: 6 }}>
							<Tooltip label="List view" openDelay={500}>
								<ActionIcon
									variant={viewMode === "list" ? "white" : "transparent"}
									color={viewMode === "list" ? "charcoal" : "dimmed"}
									onClick={() => onViewModeChange("list")}
									size="md"
									radius="sm"
									style={{
										boxShadow:
											viewMode === "list" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
									}}
								>
									<List size={18} />
								</ActionIcon>
							</Tooltip>
							<Tooltip label="Grid view" openDelay={500}>
								<ActionIcon
									variant={viewMode === "grid" ? "white" : "transparent"}
									color={viewMode === "grid" ? "charcoal" : "dimmed"}
									onClick={() => onViewModeChange("grid")}
									size="md"
									radius="sm"
									style={{
										boxShadow:
											viewMode === "grid" ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
									}}
								>
									<Grid size={18} />
								</ActionIcon>
							</Tooltip>
						</Group>

						<Button
							variant="subtle"
							color="charcoal"
							leftSection={<FolderPlus size={16} />}
							onClick={onCreateFolder}
							size="sm"
						>
							New Folder
						</Button>

						<DocxUploadButton onFilesSelected={onUpload} loading={isUploading} />
					</Group>
				</Group>

				{uploadErrors.length > 0 && (
					<Alert
						color="on-air-red"
						icon={<AlertCircle size={16} />}
						mt="sm"
						withCloseButton
						onClose={onResetUpload}
					>
						{uploadErrors.map((err) => (
							<Text key={err} size="sm">
								{err}
							</Text>
						))}
					</Alert>
				)}
			</Box>
		</>
	);
}
