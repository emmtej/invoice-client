import { useCallback, useState } from "react";
import type { Script } from "@/types/Script";
import { notify } from "@/utils/notifications";
import { useScriptStore } from "../store/scriptEditorStore";
import { reparseHtmlToScript } from "../utils/documentParser";

export function usePasteHandler(scriptCount: number) {
	const addScripts = useScriptStore((s) => s.addScripts);
	const selectScript = useScriptStore((s) => s.selectScript);
	const [pasteError, setPasteError] = useState<string | null>(null);

	const handlePasteProcessed = useCallback(
		async (html: string) => {
			const { lines, overview, html: parsedHtml } = reparseHtmlToScript(html);

			if (lines.length === 0) {
				const msg =
					"No billable dialogue or lines were found in the pasted content. Please check the format.";
				setPasteError(msg);
				notify.error({ message: msg });
				return;
			}

			const newScript: Script = {
				id: `pasted-${Date.now()}`,
				name: `Pasted Content ${scriptCount + 1}`,
				// Placeholder Document — paste has no source file
				source: document.implementation.createHTMLDocument(),
				lines,
				overview,
				html: parsedHtml,
				createdAt: new Date(),
			};

			await addScripts([newScript]);
			await selectScript(newScript.id);
			setPasteError(null);
		},
		[addScripts, selectScript, scriptCount],
	);

	return {
		pasteError,
		clearPasteError: () => setPasteError(null),
		handlePasteProcessed,
	};
}
