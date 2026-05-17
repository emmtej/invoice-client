"use client";

import { Stack } from "@mantine/core";
import { BENTO_SECTION_COPY } from "../config";
import { BentoFeatures } from "./BentoFeatures";
import { HomeSection } from "./HomeSection";
import { SectionIntro } from "./SectionIntro";

export function BentoSection() {
	return (
		<HomeSection className="py-24 md:py-32 bg-white relative z-10 border-y border-slate-100">
			<Stack gap={80}>
				<SectionIntro
					eyebrow={BENTO_SECTION_COPY.eyebrow}
					title={
						<>
							Everything you need to bill <br />
							with absolute confidence.
						</>
					}
					description={BENTO_SECTION_COPY.description}
				/>
				<BentoFeatures />
			</Stack>
		</HomeSection>
	);
}
