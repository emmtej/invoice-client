"use client";

import { Group, Stack, Text } from "@mantine/core";
import { FileDown } from "lucide-react";
import { memo } from "react";

export const ExportPreviewMock = memo(function ExportPreviewMock() {
	return (
		<div className="rounded-3xl border p-6">
			<Stack gap="md">
				<Group justify="space-between" align="center">
					<Text size="xs" fw={700} className="uppercase tracking-[0.14em]">
						Session summary
					</Text>
					<span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]">
						<FileDown size={12} strokeWidth={1.5} />
						PDF summary
					</span>
				</Group>
				<div className="space-y-2 border-t pt-4">
					<Group justify="space-between">
						<Text size="sm" c="dimmed">
							S02E04_Pickups_v2
						</Text>
						<Text size="sm" fw={700} className="font-mono">
							1,247 wds
						</Text>
					</Group>
					<Group justify="space-between">
						<Text size="sm" c="dimmed">
							Studio rate
						</Text>
						<Text size="sm" fw={700} className="font-mono">
							$0.18 / wd
						</Text>
					</Group>
					<Group justify="space-between border-t pt-3">
						<Text size="sm" fw={700} >
							Line total
						</Text>
						<Text size="sm" fw={700} className="font-mono">
							$224.46
						</Text>
					</Group>
				</div>
			</Stack>
		</div>
	);
});
