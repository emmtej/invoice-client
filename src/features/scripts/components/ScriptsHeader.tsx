import { Alert, Box, Breadcrumbs, Button, Center, Group, SegmentedControl, Text } from "@mantine/core";
import { AlertCircle, ChevronRight, FolderPlus, LayoutGrid, List, Upload } from "lucide-react";
import { PageTitle } from "@/components/ui/text/PageTitle";
import { DocxUploadButton } from "@/components/ui/button/DocxUploadButton";

interface ScriptsHeaderProps {
	uploadErrors: string[];
	onResetUpload: () => void;
	viewMode: "grid" | "list";
	onViewModeChange: (mode: "grid" | "list") => void;
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
				<Group justify="space-between" align="flex-end" mb="md">
					<PageTitle>Scripts</PageTitle>

					<Group gap="sm">
						<SegmentedControl
							value={viewMode}
							onChange={(value) => onViewModeChange(value as "grid" | "list")}
							data={[
								{
									value: "grid",
									label: (
										<Center>
											<LayoutGrid size={16} />
										</Center>
									),
								},
								{
									value: "list",
									label: (
										<Center>
											<List size={16} />
										</Center>
									),
								},
							]}
						/>

						<Button
							variant="light"
							color="studio-blue"
							leftSection={<FolderPlus size={16} />}
							onClick={onCreateFolder}
						>
							New Folder
						</Button>

						<DocxUploadButton
							onChange={onUpload}
							loading={isUploading}
							leftSection={<Upload size={16} />}
							multiple
						>
							Upload
						</DocxUploadButton>
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
