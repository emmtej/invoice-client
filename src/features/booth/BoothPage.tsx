import { Box, Button, Flex, Group, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { PenSquare } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { AppModal } from "@/components/ui/modal/AppModal";
import { PageTitle } from "@/components/ui/text/PageTitle";
import { useScriptStore } from "@/features/editor";
import { ScriptEditor } from "@/features/editor/components/ScriptEditor";
import { scriptsQueries } from "@/features/scripts/store/scriptsQueries";
import type { Script } from "@/types/Script";
import { EditLineModal } from "./components/EditLineModal";
import { ScriptSelector } from "./components/ScriptSelector";
import { ScriptTeleprompter } from "./components/ScriptTeleprompter";
import { SessionHistory } from "./components/SessionHistory";
import { SessionProgress } from "./components/SessionProgress";
import { SessionSummary } from "./components/SessionSummary";
import { SessionTimer } from "./components/SessionTimer";
import { useBoothKeyboard } from "./hooks/useBoothKeyboard";
import { useTimer } from "./hooks/useTimer";
import { type BoothSession, boothQueries } from "./store/boothQueries";
import { useBoothStore } from "./store/useBoothStore";

export default function BoothPage() {
	const {
		script,
		status,
		sessions,
		isLoadingSessions,
		setScript,
		updateScript,
		restoreSession,
		editLine,
		loadSessions,
		deleteSessionRecord,
		getLineContent,
		isSelectionMode,
		isSessionMode,
	} = useBoothStore(
		useShallow((s) => ({
			script: s.script,
			status: s.status,
			sessions: s.sessions,
			isLoadingSessions: s.isLoadingSessions,
			setScript: s.setScript,
			updateScript: s.updateScript,
			restoreSession: s.restoreSession,
			editLine: s.editLine,
			loadSessions: s.loadSessions,
			deleteSessionRecord: s.deleteSessionRecord,
			getLineContent: s.getLineContent,
			isSelectionMode: s.isSelectionMode(),
			isSessionMode: s.isSessionMode(),
		})),
	);

	useTimer();
	useBoothKeyboard();

	useEffect(() => {
		loadSessions();
	}, [loadSessions]);

	useEffect(() => {
		const handleBeforeUnload = () => {
			const { sessionId, status: currentStatus } = useBoothStore.getState();
			if (
				sessionId &&
				(currentStatus === "running" || currentStatus === "paused")
			) {
				boothQueries.abandonSession(sessionId);
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, []);

	const [editModalOpened, { open: openEditModal, close: closeEditModal }] =
		useDisclosure(false);
	const [editingLineIndex, setEditingLineIndex] = useState<number>(0);
	const [
		scriptEditorOpened,
		{ open: openScriptEditor, close: closeScriptEditor },
	] = useDisclosure(false);
	const [isScriptEditorEditing, setIsScriptEditorEditing] = useState(true);

	const editorScripts = useScriptStore((s) => s.scripts);
	const addScriptsToEditorStore = useScriptStore((s) => s.addScripts);

	const handleExpandEdit = useCallback(
		(lineIndex: number) => {
			setEditingLineIndex(lineIndex);
			openEditModal();
		},
		[openEditModal],
	);

	const handleSelectScript = useCallback(
		(selected: Script) => {
			setScript(selected);
		},
		[setScript],
	);

	const handleSelectSession = useCallback(
		async (session: BoothSession) => {
			if (session.status !== "in_progress") return;
			const scriptForSession = await scriptsQueries.getScriptById(
				session.scriptId,
			);
			if (!scriptForSession) return;
			restoreSession(scriptForSession, session);
		},
		[restoreSession],
	);

	const handleOpenScriptEditor = useCallback(async () => {
		if (!script) return;
		await addScriptsToEditorStore([script]);
		setIsScriptEditorEditing(true);
		openScriptEditor();
	}, [script, addScriptsToEditorStore, openScriptEditor]);

	const handleCloseScriptEditor = useCallback(() => {
		setIsScriptEditorEditing(false);
		closeScriptEditor();
	}, [closeScriptEditor]);

	const editingLine =
		script && editingLineIndex < script.lines.length
			? script.lines[editingLineIndex]
			: null;

	const editingContent = getLineContent(editingLineIndex);

	const scriptInEditorStore = script
		? (editorScripts.find((s) => s.id === script.id) ?? null)
		: null;

	useEffect(() => {
		if (!scriptEditorOpened || !script || !scriptInEditorStore) return;
		// Only update if it's the same script and content has changed
		if (
			scriptInEditorStore.id === script.id &&
			scriptInEditorStore.html !== script.html
		) {
			updateScript(scriptInEditorStore);
		}
	}, [scriptEditorOpened, script, scriptInEditorStore, updateScript]);

	return (
		<Flex direction="column" h="100%" mih={0}>
			<Box px="md" pt="md" flex="0 0 auto">
				<Group justify="space-between" align="flex-start" wrap="nowrap">
					<Box>
						<PageTitle>Booth</PageTitle>
						<Text c="gray.5" mt={4}>
							Track your recording sessions line by line
						</Text>
					</Box>
					<Button
						variant="light"
						color="wave"
						leftSection={<PenSquare size={16} />}
						onClick={handleOpenScriptEditor}
						disabled={!script}
					>
						Open Editor
					</Button>
				</Group>
			</Box>

			{isSelectionMode && (
				<Stack
					gap="xl"
					px="md"
					py="md"
					flex={1}
					mih={0}
					style={{ overflow: "auto" }}
				>
					<ScriptSelector onSelect={handleSelectScript} />

					{script && (
						<Box>
							<SessionTimer />
						</Box>
					)}

					<SessionHistory
						sessions={sessions}
						isLoading={isLoadingSessions}
						onDelete={deleteSessionRecord}
						onSelect={handleSelectSession}
					/>
				</Stack>
			)}

			{isSessionMode && status !== "completed" && (
				<Flex
					direction={{ base: "column", md: "row" }}
					flex={1}
					mih={0}
					gap="md"
					px="md"
					pb="md"
					pt="md"
				>
					<Flex direction="column" flex={1} mih={0} gap="sm">
						{script && (
							<Box flex="0 0 auto">
								<Text
									fw={900}
									fz={{ base: 24, md: 32 }}
									c="gray.8"
									lh={1.1}
									ta="left"
								>
									{script.name}
								</Text>
							</Box>
						)}
						<Box flex="0 0 auto">
							<SessionProgress />
						</Box>
						<Box flex={1} mih={0}>
							<ScriptTeleprompter onExpandEdit={handleExpandEdit} />
						</Box>
					</Flex>
					<Box
						w={{ base: "100%", md: 320 }}
						flex="0 0 auto"
						style={{
							borderLeft: "1px solid var(--mantine-color-gray-2)",
						}}
						pl={{ base: 0, md: "md" }}
					>
						<SessionTimer />
					</Box>
				</Flex>
			)}

			{status === "completed" && (
				<Stack px="md" py="md" flex={1} mih={0} style={{ overflow: "auto" }}>
					<SessionSummary />
				</Stack>
			)}

			<EditLineModal
				opened={editModalOpened}
				onClose={closeEditModal}
				line={editingLine}
				lineIndex={editingLineIndex}
				currentContent={editingContent}
				onSave={editLine}
			/>

			<AppModal
				opened={scriptEditorOpened}
				onClose={handleCloseScriptEditor}
				title={script ? `Script Editor: ${script.name}` : "Script Editor"}
				size="90vw"
			>
				<Box h="70vh" mih={500}>
					{scriptInEditorStore && (
						<ScriptEditor
							script={scriptInEditorStore}
							isEditing={isScriptEditorEditing}
							onStartEdit={() => setIsScriptEditorEditing(true)}
							onStopEdit={() => setIsScriptEditorEditing(false)}
						/>
					)}
				</Box>
			</AppModal>
		</Flex>
	);
}
