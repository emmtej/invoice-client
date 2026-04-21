import { Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { FileUp } from "lucide-react";

const DOCX_ACCEPT = [
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

export interface DocxUploadDropzoneProps {
	onFilesSelected: (files: File[]) => void;
	loading?: boolean;
	disabled?: boolean;
	multiple?: boolean;
	/** Larger copy and hit target for empty states; compact row for toolbars. */
	variant?: "default" | "compact";
}

export function DocxUploadDropzone({
	onFilesSelected,
	loading = false,
	disabled = false,
	multiple = true,
	variant = "default",
}: DocxUploadDropzoneProps) {
	const isCompact = variant === "compact";
	const minHeight = isCompact ? 72 : 132;
	const iconSize = isCompact ? 22 : 28;

	return (
		<Dropzone
			onDrop={(files) => onFilesSelected([...files])}
			accept={DOCX_ACCEPT}
			multiple={multiple}
			loading={loading}
			disabled={disabled}
			radius="md"
			variant="light"
			acceptColor="wave"
			rejectColor="red"
			style={{ width: "100%" }}
		>
			<Group
				justify="center"
				align="center"
				gap="md"
				mih={minHeight}
				px="md"
				py={isCompact ? "xs" : "sm"}
				wrap="nowrap"
				style={{ pointerEvents: "none" }}
			>
				<Dropzone.Accept>
					<Group gap="sm" wrap="nowrap">
						<ThemeIcon variant="light" color="wave" size="lg" radius="md">
							<FileUp size={iconSize} strokeWidth={2} />
						</ThemeIcon>
						<Text size="sm" fw={600} c="wave.8">
							Drop to upload
						</Text>
					</Group>
				</Dropzone.Accept>
				<Dropzone.Reject>
					<Text size="sm" fw={600} c="red.7">
						Only .docx files are supported
					</Text>
				</Dropzone.Reject>
				<Dropzone.Idle>
					<Group gap="sm" wrap="nowrap" align="center">
						<ThemeIcon variant="light" color="wave" size="lg" radius="md">
							<FileUp size={iconSize} strokeWidth={2} />
						</ThemeIcon>
						<Stack gap={2}>
							<Text size="sm" fw={600} c="gray.8">
								{isCompact
									? "Drop Word documents here or click to browse"
									: "Drop Word documents here"}
							</Text>
							{!isCompact && (
								<Text size="xs" c="dimmed">
									.docx only — or click to choose files
								</Text>
							)}
						</Stack>
					</Group>
				</Dropzone.Idle>
			</Group>
		</Dropzone>
	);
}
