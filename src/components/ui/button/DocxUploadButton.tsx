import { Button, type ButtonProps, FileButton } from "@mantine/core";
import type { ReactNode } from "react";

const DOCX_ACCEPT =
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document";

interface DocxUploadButtonProps extends Omit<ButtonProps, "onChange"> {
	onChange: (files: File[]) => void;
	multiple?: boolean;
	children?: ReactNode;
}

export function DocxUploadButton({
	onChange,
	multiple = false,
	children = "Upload Document(s)",
	...buttonProps
}: DocxUploadButtonProps) {
	const handleChange = (payload: File | File[] | null) => {
		if (payload === null) return;
		onChange(Array.isArray(payload) ? payload : [payload]);
	};

	return (
		<FileButton onChange={handleChange} accept={DOCX_ACCEPT} multiple={multiple}>
			{(fileProps) => (
				<Button
					{...fileProps}
					variant="filled"
					color="studio"
					{...buttonProps}
				>
					{children}
				</Button>
			)}
		</FileButton>
	);
}
