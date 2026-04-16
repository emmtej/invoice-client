import {
	Badge,
	Box,
	Button,
	Center,
	Flex,
	Group,
	Loader,
	Stack,
	Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Clock, PenSquare } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { SurfaceCard } from "@/components/ui/card/SurfaceCard";
import { AppModal } from "@/components/ui/modal/AppModal";
import { PageTitle } from "@/components/ui/text/PageTitle";
import { SectionLabel } from "@/components/ui/text/SectionLabel";
import { useScriptStore } from "@/features/editor";
import { ScriptEditor } from "@/features/editor/components/ScriptEditor";
import { scriptsQueries } from "@/features/scripts/store/scriptsQueries";
import type { Script } from "@/types/Script";
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
		resetSession,
		loadSessions,
		deleteSessionRecord,
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
			resetSession: s.resetSession,
			loadSessions: s.loadSessions,
			deleteSessionRecord: s.deleteSessionRecord,
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

	const [
		scriptEditorOpened,
		{ open: openScriptEditor, close: closeScriptEditor },
	] = useDisclosure(false);
	const [isScriptEditorEditing, setIsScriptEditorEditing] = useState(true);
	const [isLoadingScripts, setIsLoadingScripts] = useState(true);

	const isInitialLoading =
		(isLoadingSessions || isLoadingScripts) && isSelectionMode;

	const editorScripts = useScriptStore((s) => s.scripts);
	const addScriptsToEditorStore = useScriptStore((s) => s.addScripts);

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

	const scriptInEditorStore = script
		? (editorScripts.find((s) => s.id === script.id) ?? null)
		: null;

	const ongoingSession = sessions.find((s) => s.status === "in_progress");

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
				</Group>
			</Box>

			{isSelectionMode && (
				<Flex
					direction={{ base: "column", md: "row" }}
					flex={1}
					mih={0}
					gap="xl"
					px="md"
					py="md"
				>
					{isInitialLoading && (
						<Center flex={1}>
							<Stack align="center" gap="xs">
								<Loader color="wave" size="sm" />
								<Text size="sm" c="gray.6" fw={500}>
									Loading...
								</Text>
							</Stack>
						</Center>
					)}

					<Stack
						gap="xl"
						flex={1}
						mih={0}
						style={{
							overflow: "auto",
							display: isInitialLoading ? "none" : "flex",
						}}
					>
						{ongoingSession && (
							<Stack gap="sm">
								<Text fw={700} size="sm" c="gray.6" tt="uppercase" lts={0.5}>
									Ongoing Session
								</Text>
								<SurfaceCard
									style={{
										border: "2px solid var(--mantine-color-wave-3)",
										backgroundColor: "var(--mantine-color-wave-0)",
										boxShadow: "0 4px 12px rgba(0, 150, 136, 0.08)",
									}}
								>
									<Group justify="space-between" align="center">
										<Box>
											<Text fw={800} size="xl" c="gray.8">
												{ongoingSession.scriptName}
											</Text>
											<Text size="sm" c="gray.6">
												Started{" "}
												{new Date(ongoingSession.startedAt).toLocaleString()}
											</Text>
											<Group gap="md" mt={8}>
												<Badge variant="filled" color="wave" size="md">
													{ongoingSession.completedLines} /{" "}
													{ongoingSession.totalLines} lines
												</Badge>
												<Group gap="xs">
													<Clock size={14} color="var(--mantine-color-gray-5)" />
													<Text size="sm" c="gray.6" ff="monospace">
														{Math.floor(ongoingSession.elapsedMs / 1000 / 60)}m{" "}
														{Math.floor(
															(ongoingSession.elapsedMs / 1000) % 60,
														).toString()
															.padStart(2, "0")}s
													</Text>
												</Group>
											</Group>
										</Box>
										<Button
											color="wave"
											size="lg"
											onClick={() => handleSelectSession(ongoingSession)}
											leftSection={<Clock size={20} />}
											style={{
												transition: "transform 150ms ease",
											}}
											className="hover:scale-105 active:scale-95"
										>
											Resume Session
										</Button>
									</Group>
								</SurfaceCard>
							</Stack>
						)}

						<Stack gap="md">
							<Group justify="space-between" align="center">
								<Text fw={700} size="sm" c="gray.6" tt="uppercase" lts={0.5}>
									{status === "selecting" ? "Selected Script" : "Start New Session"}
								</Text>
								{status === "selecting" && (
									<Button
										variant="subtle"
										color="gray"
										size="xs"
										onClick={resetSession}
									>
										Choose another script
									</Button>
								)}
							</Group>

							{status === "idle" && (
								<ScriptSelector
									onSelect={handleSelectScript}
									onLoadingChange={setIsLoadingScripts}
									hideLoader={isInitialLoading}
								/>
							)}

							{status === "selecting" && script && (
								<SurfaceCard py={40} style={{ border: "1px dashed var(--mantine-color-gray-3)" }}>
									<Stack align="center" gap="xl">
										<Box ta="center">
											<Text fw={800} size="24px" c="gray.8">
												{script.name}
											</Text>
											<Text size="sm" c="gray.6" mt={4}>
												Ready to start recording
											</Text>
										</Box>
										<SessionTimer />
									</Stack>
								</SurfaceCard>
							)}
						</Stack>
					</Stack>

					{!isInitialLoading && (
						<Box
							w={{ base: "100%", md: 320 }}
							style={{
								borderLeft: "1px solid var(--mantine-color-gray-2)",
								display: "flex",
								flexDirection: "column",
							}}
							pl={{ base: 0, md: "xl" }}
							pt={{ base: "xl", md: 0 }}
						>
							<SectionLabel mb="md">Sessions</SectionLabel>
							<SessionHistory
								sessions={
									ongoingSession
										? sessions.filter((s) => s.id !== ongoingSession.id)
										: sessions
								}
								isLoading={isLoadingSessions}
								onDelete={deleteSessionRecord}
								onSelect={handleSelectSession}
								hideLoader={isInitialLoading}
							/>
						</Box>
					)}
				</Flex>
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
							<Group justify="space-between" align="center" flex="0 0 auto">
								<Text
									fw={900}
									fz={{ base: 24, md: 32 }}
									c="gray.8"
									lh={1.1}
									ta="left"
								>
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
						)}
						<Box flex="0 0 auto">
							<SessionProgress />
						</Box>
						<Box flex={1} mih={0}>
							<ScriptTeleprompter />
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
