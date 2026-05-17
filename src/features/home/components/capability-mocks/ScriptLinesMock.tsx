"use client";

import { Group, Text, ThemeIcon } from "@mantine/core";
import { FileText } from "lucide-react";
import { memo } from "react";

const SCRIPTS = [
	{ name: "S02E04_Pickups_v2.docx", words: "1,247 wds", live: true },
	{ name: "NationalSpot_30s.docx", words: "112 wds", live: false },
	{ name: "Audiobook_Ch14_rev.docx", words: "4,892 wds", live: false },
] as const;

export const ScriptLinesMock = memo(function ScriptLinesMock() {
	return (
		<div className="space-y-3">
			{SCRIPTS.map((script) => (
				<div
					key={script.name}
					className="flex items-center justify-between rounded-2xl border px-4 py-3"
				>
					<Group gap="md">
						<ThemeIcon variant="light" color="blue" size="md">
							<FileText size={16} strokeWidth={1.5} />
						</ThemeIcon>
						<Text size="sm" fw={600} className="tracking-tight">
							{script.name}
						</Text>
					</Group>
					<Group gap={8}>
						{script.live ? (
							<span
								className="h-2 w-2 rounded-full bg-red-6"
								aria-hidden
							/>
						) : null}
						<Text size="xs" fw={700} className="font-mono">
							{script.words}
						</Text>
					</Group>
				</div>
			))}
		</div>
	);
});
