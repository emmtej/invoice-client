import { Box, ScrollArea } from "@mantine/core";
import { useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { useBoothStore } from "../store/useBoothStore";
import { TeleprompterLine } from "./TeleprompterLine";

export function ScriptTeleprompter() {
	const {
		script,
		status,
		completedLineIndices,
		currentLineIndex,
		completeLine,
		editLine,
		getLineContent,
	} = useBoothStore(
		useShallow((s) => ({
			script: s.script,
			status: s.status,
			completedLineIndices: s.completedLineIndices,
			currentLineIndex: s.currentLineIndex,
			completeLine: s.completeLine,
			editLine: s.editLine,
			getLineContent: s.getLineContent,
		})),
	);

	const lineRefs = useRef<Map<number, HTMLDivElement>>(new Map());
	const viewportRef = useRef<HTMLDivElement>(null);
	const completedSet = new Set(completedLineIndices);

	if (!script) return null;
	const isSessionRunning = status === "running";

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
									isCurrent={currentLineIndex === index}
									isCompleted={completedSet.has(index)}
									isSessionRunning={isSessionRunning}
									onComplete={completeLine}
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
