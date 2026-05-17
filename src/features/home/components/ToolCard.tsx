"use client";

import { Box, Group, Stack, Text, ThemeIcon } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { MagneticWrapper } from "@/components/ui/motion/MagneticWrapper";
import { initDb } from "@/features/storage/pgliteClient";
import type { HomeTool } from "../config";

interface ToolCardProps {
	tool: HomeTool;
}

export function ToolCard({ tool }: ToolCardProps) {
	const Icon = tool.icon;

	return (
		<MagneticWrapper strength={10}>
			<Box
				component={Link}
				to={tool.to}
				onMouseEnter={() => initDb()}
				className="group p-8 bg-white rounded-[2rem] border border-slate-200/50 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.03)] hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.08)] transition-all text-left block no-underline"
			>
				<Stack gap="lg">
					<ThemeIcon
						color={tool.color}
						variant="light"
						size={48}
						radius="xl"
						className="group-hover:scale-110 transition-transform"
					>
						<Icon size={24} />
					</ThemeIcon>
					<div>
						<Text
							fw={700}
							size="lg"
							c="brand-dark.7"
							className="mb-1 tracking-tight"
						>
							{tool.title}
						</Text>
						<Text size="sm" c="brand-dark-4" className="opacity-80">
							{tool.description}
						</Text>
					</div>
					<Group
						gap={4}
						className="opacity-0 group-hover:opacity-100 transition-opacity"
					>
						<Text
							size="xs"
							fw={700}
							c="brand-dark.5"
							tt="uppercase"
							lts="0.05em"
						>
							Open
						</Text>
						<ArrowRight size={14} className="text-brand-dark-3" />
					</Group>
				</Stack>
			</Box>
		</MagneticWrapper>
	);
}
