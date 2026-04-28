import { Box, ScrollArea } from "@mantine/core";
import { useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { useBoothSettingsStore } from "../store/useBoothSettingsStore";
import { useBoothStore } from "../store/useBoothStore";
import { TeleprompterLine } from "./TeleprompterLine";

export function ScriptTeleprompter() {
	const {
		script,
		status,
		completedLineIndices,
		currentLineIndex,
		completeLine,
		completeScene,
		editLine,
		getLineContent,
	} = useBoothStore(
		useShallow((s) => ({
			script: s.script,
			status: s.status,
			completedLineIndices: s.completedLineIndices,
			currentLineIndex: s.currentLineIndex,
			completeLine: s.completeLine,
			completeScene: s.completeScene,
			editLine: s.editLine,
			getLineContent: s.getLineContent,
		})),
	);

	const { trackingMode } = useBoothSettingsStore(
		useShallow((s) => ({ trackingMode: s.trackingMode })),
	);

	const lineRefs = useRef<Map<number, HTMLDivElement>>(new Map());
	const viewportRef = useRef<HTMLDivElement>(null);
	const completedSet = new Set(completedLineIndices);

	if (!script) return null;
	const isSessionRunning = status === "running";
	const isSceneMode = trackingMode === "scene";

	// In scene mode, find which scene marker the current line belongs to
	let currentSceneMarkerIndex = -1;
	if (isSceneMode) {
		for (let i = currentLineIndex; i >= 0; i--) {
			if (script.lines[i].type === "marker") {
				currentSceneMarkerIndex = i;
				break;
			}
		}
	}

	return (
		<Box h="100%" mah="100%" mih={0} style={{ overflow: "hidden" }}>
			<ScrollArea
				h="100%"
				mah="100%"
				viewportRef={viewportRef}
				offsetScrollbars
				scrollbarSize={6}
			>
				<Box py="xs">
					{script.lines.map((line, index) => {
						const isReadable =
							line.type === "dialogue" || line.type === "action";
						const isMarker = line.type === "marker";
						if (!isReadable && !isMarker) return null;

						const isCurrent = isSceneMode
							? index === currentSceneMarkerIndex
							: index === currentLineIndex;

						const isCompleted =
							isSceneMode && isMarker
								? false // We'll compute this below
								: completedSet.has(index);

						// For markers in scene mode, it's completed if ALL readable lines under it are completed
						let isMarkerCompleted = false;
						if (isSceneMode && isMarker) {
							let allDone = true;
							let foundAny = false;
							for (let i = index + 1; i < script.lines.length; i++) {
								const l = script.lines[i];
								if (l.type === "marker") break;
								if (l.type === "dialogue" || l.type === "action") {
									foundAny = true;
									if (!completedSet.has(i)) {
										allDone = false;
										break;
									}
								}
							}
							isMarkerCompleted = foundAny && allDone;
						}

						return (
							<div
								key={line.id ?? index}
								ref={(el) => {
									if (el) lineRefs.current.set(index, el);
									else lineRefs.current.delete(index);
								}}
							>
								<TeleprompterLine
									line={line}
									content={getLineContent(index)}
									lineIndex={index}
									isCurrent={isCurrent}
									isCompleted={
										isSceneMode && isMarker ? isMarkerCompleted : isCompleted
									}
									isSessionRunning={isSessionRunning}
									trackingMode={trackingMode}
									onComplete={completeLine}
									onCompleteScene={completeScene}
									onEdit={editLine}
								/>
							</div>
						);
					})}
				</Box>
			</ScrollArea>
		</Box>
	);
}
