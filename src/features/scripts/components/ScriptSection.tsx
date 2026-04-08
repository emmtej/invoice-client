import { Stack } from "@mantine/core";
import { SectionLabel } from "@/components/ui/text/SectionLabel";
import type { ScriptSummary } from "@/features/storage/types";
import { ScriptRow } from "./ScriptRow";

interface ScriptSectionProps {
	scripts: ScriptSummary[];
	selectedScriptId: string | null;
	onSelect: (scriptId: string) => void;
	onDelete: (script: ScriptSummary) => void;
}

export function ScriptSection({
	scripts,
	selectedScriptId,
	onSelect,
	onDelete,
}: ScriptSectionProps) {
	return (
		<Stack gap="sm">
			<SectionLabel>Scripts ({scripts.length})</SectionLabel>
			<Stack gap={0}>
				{scripts.map((script) => (
					<ScriptRow
						key={script.id}
						script={script}
						isSelected={script.id === selectedScriptId}
						onClick={() => onSelect(script.id)}
						onDelete={() => onDelete(script)}
					/>
				))}
			</Stack>
		</Stack>
	);
}
