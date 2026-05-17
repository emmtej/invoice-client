"use client";

import { Text, ThemeIcon } from "@mantine/core";
import { FileText, Receipt, ScanText } from "lucide-react";
import { memo } from "react";

const STEPS = [
	{ label: "Parse script", icon: ScanText },
	{ label: "Count dialogue", icon: FileText },
	{ label: "Build invoice", icon: Receipt },
] as const;

export const WorkflowStepsMock = memo(function WorkflowStepsMock() {
	return (
		<div className="relative rounded-3xl border bg-gray-0 p-8">
			<div aria-hidden className="absolute left-10 right-10 top-[2.65rem] h-px bg-gray-3" />
			<ol className="relative grid gap-8 sm:grid-cols-3 sm:gap-4">
				{STEPS.map((step, index) => {
					const Icon = step.icon;
					return (
						<li key={step.label} className="flex flex-col gap-3 sm:items-center sm:text-center">
							<ThemeIcon size={44} variant="light" color="gray" radius="xl">
								<Icon size={20} strokeWidth={1.5} />
							</ThemeIcon>
							<Text size="xs" fw={700} className="uppercase tracking-[0.12em]">
								Step {index + 1}
							</Text>
							<Text size="sm" fw={600} className="tracking-tight">
								{step.label}
							</Text>
						</li>
					);
				})}
			</ol>
		</div>
	);
});
