import { Button, Group, Text } from "@mantine/core";
import { PenSquare } from "lucide-react";
import { useCallback } from "react";
import { useShallow } from "zustand/react/shallow";
import { useScriptStore } from "@/features/editor";
import { useBoothStore } from "../store/useBoothStore";

export function ActiveSessionHeader() {
	const { script, setEditorOpened } = useBoothStore(
		useShallow((s) => ({
			script: s.script,
			setEditorOpened: s.setEditorOpened,
		})),
	);

	const addScriptsToEditorStore = useScriptStore((s) => s.addScripts);

	const handleOpenScriptEditor = useCallback(async () => {
		if (!script) return;
		await addScriptsToEditorStore([script]);
		setEditorOpened(true);
	}, [script, addScriptsToEditorStore, setEditorOpened]);

	if (!script) return null;

	return (
		<Group justify="space-between" align="center" flex="0 0 auto">
			<Text fw={900} fz={{ base: 24, md: 32 }} c="gray.8" lh={1.1} ta="left">
				{script.name}
			</Text>
			<Button
				variant="subtle"
				color="wave"
				size="sm"
				leftSection={<PenSquare size={16} />}
				onClick={handleOpenScriptEditor}
			>
				Edit Script
			</Button>
		</Group>
	);
}
