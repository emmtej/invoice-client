"use client";

import { Stack, Text, ThemeIcon } from "@mantine/core";
import { CAPABILITIES_SECTION_COPY, CAPABILITY_ROWS } from "../config";
import { ExportPreviewMock } from "./capability-mocks/ExportPreviewMock";
import { ScriptLinesMock } from "./capability-mocks/ScriptLinesMock";
import { WorkflowStepsMock } from "./capability-mocks/WorkflowStepsMock";
import { FadeInView } from "./FadeInView";
import { HomeSection } from "./HomeSection";
import { SectionIntro } from "./SectionIntro";

function CapabilityMock({ id }: { id: (typeof CAPABILITY_ROWS)[number]["id"] }) {
	switch (id) {
		case "billing":
			return <ScriptLinesMock />;
		case "workflow":
			return <WorkflowStepsMock />;
		case "export":
			return <ExportPreviewMock />;
	}
}

export function CapabilitiesSection() {
	return (
		<HomeSection
			className="bg-white"
			containerClassName="py-20 md:py-28"
		>
			<Stack gap={0}>
				<FadeInView className="mb-16 md:mb-24">
					<SectionIntro
						eyebrow={CAPABILITIES_SECTION_COPY.eyebrow}
						title={CAPABILITIES_SECTION_COPY.title}
						description={CAPABILITIES_SECTION_COPY.description}
					/>
				</FadeInView>

				{CAPABILITY_ROWS.map((row, index) => {
					const Icon = row.icon;
					const reverse = index % 2 === 1;

					return (
						<FadeInView
							key={row.id}
							delay={index * 0.05}
							className={`border-t py-16 md:py-24 ${index === 0 ? "border-t-0 pt-0" : ""}`}
						>
							<div className="grid items-center gap-10 md:grid-cols-2 md:gap-16 lg:gap-20">
								<Stack
									gap="md"
									className={`max-w-[42ch] ${reverse ? "md:order-2" : "md:order-1"}`}
								>
									<ThemeIcon size={48} variant="light" color="blue" radius={0}>
										<Icon size={22} strokeWidth={1.5} />
									</ThemeIcon>
									<h3 className="font-sans text-2xl font-semibold tracking-tight md:text-3xl">
										{row.title}
									</h3>
									<Text c="dimmed" className="text-base leading-relaxed md:text-lg">
										{row.body}
									</Text>
								</Stack>

								{row.id === "workflow" ? (
									<div className={reverse ? "md:order-1" : "md:order-2"}>
										<CapabilityMock id={row.id} />
									</div>
								) : (
									<div
										className={`rounded-none p-1.5 ring-1 ring-gray-3 ${ reverse ? "md:order-1" : "md:order-2" }`}
									>
										<div className="rounded-none border p-4">
											<CapabilityMock id={row.id} />
										</div>
									</div>
								)}
							</div>
						</FadeInView>
					);
				})}
			</Stack>
		</HomeSection>
	);
}
