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
import {
	AlertCircle,
	ChevronRight,
	FolderPlus,
	Grid,
	List,
} from "lucide-react";
import { DocxUploadButton } from "@/components/ui/DocxUploadButton";
import { PageTitle } from "@/components/ui/PageTitle";

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
			<Box px="md" py="xs" className="border-b">
				<Breadcrumbs
					separator={
						<ChevronRight
							size={14}
							strokeWidth={2.5}
						/>
					}
					separatorMargin="md"
				>
					<Text size="xs" fw={800} tt="uppercase" lts={1.5} c="dimmed">
						Script Tools
					</Text>
					<Text size="xs" fw={900} tt="uppercase" lts={1.5} c="dimmed">
						Scripts
					</Text>
				</Breadcrumbs>
			</Box>

			{/* Page header */}
			<Box px="md" pt="md">
				<Group justify="space-between" align="center">
					<PageTitle>Scripts</PageTitle>

					<Group gap="xs">
						<Group gap={0} className="p-0.5 rounded-md">
							<Tooltip label="List view" openDelay={500}>
								<ActionIcon
									variant={viewMode === "list" ? "white" : "transparent"}
									color="gray"
									onClick={() => onViewModeChange("list")}
									size="md"
									radius="sm"
									className={viewMode === "list" ? "shadow-sm" : ""}
									aria-label="List view"
								>
									<List size={18} />
								</ActionIcon>
							</Tooltip>
							<Tooltip label="Grid view" openDelay={500}>
								<ActionIcon
									variant={viewMode === "grid" ? "white" : "transparent"}
									color="gray"
									onClick={() => onViewModeChange("grid")}
									size="md"
									radius="sm"
									className={viewMode === "grid" ? "shadow-sm" : ""}
									aria-label="Grid view"
								>
									<Grid size={18} />
								</ActionIcon>
							</Tooltip>
						</Group>

						<Button
							variant="subtle"
							color="gray"
							leftSection={<FolderPlus size={16} />}
							onClick={onCreateFolder}
							size="sm"
						>
							New Folder
						</Button>

						<DocxUploadButton onChange={onUpload} loading={isUploading} />
					</Group>
				</Group>

				{uploadErrors.length > 0 && (
					<Alert
						color="red"
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
