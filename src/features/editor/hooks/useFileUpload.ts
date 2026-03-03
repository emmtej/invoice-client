import { xmlParser } from "../utils/xmlParser";
import mammoth from "mammoth";
import { useCallback, useEffect, useRef, useState } from "react";

export interface DocFile {
	name: string;
	document: Document;
}

interface UseFileUpload {
	docFiles: DocFile[];
	isLoading: boolean;
	errors: string[];
	handleFileChange: (e: React.ChangeEvent<HTMLInputElement> | File[]) => void;
	reset: () => void;
}

export function useFileUpload(): UseFileUpload {
	const [docFiles, setDocFiles] = useState<DocFile[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
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

		const filePromises = newFiles.map(async (file): Promise<DocFile> => {
			if (!file.name.endsWith(".docx")) {
				throw new Error(`File "${file.name}" is not a .docx file.`);
			}
			try {
				const arrayBuffer = await file.arrayBuffer();
				const { value } = await mammoth.convertToHtml({ arrayBuffer });

				const document = xmlParser(value);

				return {
					name: file.name,
					document,
				};
			} catch (err) {
				throw new Error(
					`Failed to parse ${file.name}: ${err instanceof Error ? err.message : String(err)}`,
				);
			}
		});

		const results = await Promise.allSettled(filePromises);
		if (!isMountedRef.current) return;

		const successfulDocs: DocFile[] = [];
		const newErrors: string[] = [];

		results.forEach((result) => {
			if (result.status === "fulfilled") {
				successfulDocs.push(result.value);
			} else {
				console.error(result.reason);
				newErrors.push(result.reason.message);
			}
		});

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
			} else if (input.target && input.target.files) {
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
	}, []);

	return {
		docFiles,
		isLoading,
		errors,
		handleFileChange,
		reset,
	};
}

