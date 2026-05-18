"use client";

import { Box, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { initDb } from "@/features/storage/pgliteClient";
import type { HomeTool } from "../config";

interface LaunchToolTileProps {
	tool: HomeTool;
}

export function LaunchToolTile({ tool }: LaunchToolTileProps) {
	const Icon = tool.icon;
	const isPrimary = tool.priority === "primary";

	return (
		<Box
			component={Link}
			to={tool.to}
			onMouseEnter={() => initDb()}
			className={`group block min-h-[140px] no-underline ${isPrimary ? "min-h-[200px] md:min-h-[220px]" : "min-h-[148px]"}`}
		>
			<div
				className={`h-full rounded-none border p-1.5 ${isPrimary ? "bg-white" : "bg-gray-0"}`}
			>
				<Stack
					gap="lg"
					className="h-full rounded-none border p-7"
					justify="space-between"
				>
					<Group justify="space-between" align="flex-start">
						<ThemeIcon color={tool.color} variant="light" size={isPrimary ? 52 : 44} radius={0}>
							<Icon size={isPrimary ? 24 : 20} strokeWidth={1.5} />
						</ThemeIcon>
						<span className="flex h-9 w-9 items-center justify-center rounded-none bg-gray-1">
							<ArrowUpRight size={16} strokeWidth={1.5} />
						</span>
					</Group>
					<div>
						<Text fw={700} size={isPrimary ? "lg" : "md"} className="mb-1 tracking-tight">
							{tool.title}
						</Text>
						<Text size="sm" c="dimmed" className="max-w-[28ch] leading-relaxed">
							{tool.description}
						</Text>
					</div>
				</Stack>
			</div>
		</Box>
	);
}
