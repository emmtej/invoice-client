"use client";

import { Stack } from "@mantine/core";
import { FEATURES_SECTION_COPY, HOME_TOOLS } from "../config";
import { FadeInView } from "./FadeInView";
import { HomeSection } from "./HomeSection";
import { LaunchToolTile } from "./LaunchToolTile";
import { SectionIntro } from "./SectionIntro";

const LEFT_COLUMN_TOOLS = HOME_TOOLS.filter((t) =>
	["/editor", "/dashboard"].includes(t.to),
);
const RIGHT_COLUMN_TOOLS = HOME_TOOLS.filter((t) =>
	["/invoice", "/profile"].includes(t.to),
);

export function FeaturesSection() {
	return (
		<HomeSection
			containerClassName="pb-12 pt-4 md:pb-16 md:pt-6"
		>
			<Stack gap={48} align="center">
				<FadeInView className="w-full max-w-2xl text-center">
					<SectionIntro
						title={FEATURES_SECTION_COPY.title}
						description={FEATURES_SECTION_COPY.description}
						align="center"
						maxWidthClassName="max-w-none mx-auto"
					/>
				</FadeInView>

				<div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
					<Stack gap={6} className="md:gap-6">
						{LEFT_COLUMN_TOOLS.map((tool, i) => (
							<FadeInView key={tool.to} delay={i * 0.06}>
								<LaunchToolTile tool={tool} />
							</FadeInView>
						))}
					</Stack>
					<Stack gap={6} className="md:mt-12 md:gap-6">
						{RIGHT_COLUMN_TOOLS.map((tool, i) => (
							<FadeInView key={tool.to} delay={0.08 + i * 0.06}>
								<LaunchToolTile tool={tool} />
							</FadeInView>
						))}
					</Stack>
				</div>
			</Stack>
		</HomeSection>
	);
}
