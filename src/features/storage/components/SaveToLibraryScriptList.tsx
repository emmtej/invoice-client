import { Box, Checkbox, ScrollArea, Stack } from "@mantine/core";
import { SectionLabel } from "@/components/ui/text/SectionLabel";
import type { ScriptMetadata } from "@/types/Script";

interface SaveToLibraryScriptListProps {
	scripts: ScriptMetadata[];
	selectedIds: Set<string>;
	onToggle: (id: string) => void;
	label: string;
}

export function SaveToLibraryScriptList({
	scripts,
	selectedIds,
	onToggle,
	label,
}: SaveToLibraryScriptListProps) {
	if (scripts.length === 0) return null;

	return (
		<Box>
			<SectionLabel mb={8}>
				Select {label} ({selectedIds.size})
			</SectionLabel>
			<ScrollArea
				h={150}
				style={{ border: "1px solid var(--mantine-color-gray-2)" }}
				p="xs"
			>
				<Stack gap={4}>
					{scripts.map((s) => (
						<Checkbox
							key={s.id}
							label={s.name}
							checked={selectedIds.has(s.id)}
							onChange={() => onToggle(s.id)}
							color="blue"
							size="sm"
							styles={{
								label: { cursor: "pointer" },
								input: { cursor: "pointer" },
							}}
						/>
					))}
				</Stack>
			</ScrollArea>
		</Box>
	);
}
