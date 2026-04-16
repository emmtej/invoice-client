import mammoth from "mammoth";
import { useCallback, useEffect, useRef, useState } from "react";
import { parseHtmlToDocument } from "../utils/parseHtmlToDocument";

export interface DocFile {
	name: string;
	document: Document;
}

interface UseFileUpload {
	docFiles: DocFile[];
	isLoading: boolean;
	processedCount: number;
	totalCount: number;
	errors: string[];
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement> | File[]) => void;
	reset: () => void;
}

export function useFileUpload(): UseFileUpload {
	const [docFiles, setDocFiles] = useState<DocFile[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [processedCount, setProcessedCount] = useState<number>(0);
	const [totalCount, setTotalCount] = useState<number>(0);
	const [errors, setErrors] = useState<string[]>([]);
	const isMountedRef = useRef(true);

	useEffect(() => {
		isMountedRef.current = true;
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	const processFiles = useCallback(async (newFiles: File[]) => {
		setIsLoading(true);
		setErrors([]);
		setTotalCount(newFiles.length);
		setProcessedCount(0);

		const successfulDocs: DocFile[] = [];
		const newErrors: string[] = [];

		for (const file of newFiles) {
			if (!isMountedRef.current) break;

			try {
				if (!file.name.endsWith(".docx")) {
					throw new Error(`File "${file.name}" is not a .docx file.`);
				}

				const arrayBuffer = await file.arrayBuffer();
				const { value } = await mammoth.convertToHtml({ arrayBuffer });
				const document = parseHtmlToDocument(value);

				successfulDocs.push({
					name: file.name,
					document,
				});
			} catch (err) {
				console.error(err);
				newErrors.push(
					err instanceof Error ? err.message : `Failed to parse ${file.name}`,
				);
			} finally {
				setProcessedCount((prev) => prev + 1);
			}
		}

		if (!isMountedRef.current) return;

		if (newErrors.length > 0) {
			setErrors((prev) => [...prev, ...newErrors]);
		}

		if (successfulDocs.length > 0) {
			setDocFiles((prev) => [...prev, ...successfulDocs]);
		}

		setIsLoading(false);
	}, []);

	const handleFileChange = useCallback(
		(input: React.ChangeEvent<HTMLInputElement> | File[]) => {
			let incomingFiles: File[] = [];

			if (Array.isArray(input)) {
				incomingFiles = input;
			} else if (input.target?.files) {
				incomingFiles = Array.from(input.target.files);
			}

			if (incomingFiles.length > 0) {
				processFiles(incomingFiles);
			}
		},
		[processFiles],
	);

	// Resets
	const reset = useCallback(() => {
		setDocFiles([]);
		setErrors([]);
		setIsLoading(false);
		setProcessedCount(0);
		setTotalCount(0);
	}, []);

	return {
		docFiles,
		isLoading,
		processedCount,
		totalCount,
		errors,
		handleFileChange,
		reset,
	};
}
