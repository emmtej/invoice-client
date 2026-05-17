"use client";

import { Button, SimpleGrid, Stack } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { MagneticWrapper } from "@/components/ui/motion/MagneticWrapper";
import { FEATURES_SECTION_COPY, HOME_TOOLS } from "../config";
import { HomeSection } from "./HomeSection";
import { SectionIntro } from "./SectionIntro";
import { ToolCard } from "./ToolCard";

export function FeaturesSection() {
	return (
		<HomeSection
			className="py-24 md:py-32 lg:py-48 bg-alabaster"
			align="center"
		>
			<Stack gap={64} align="center">
				<SectionIntro
					title={FEATURES_SECTION_COPY.title}
					description={FEATURES_SECTION_COPY.description}
					align="center"
					maxWidthClassName="max-w-none"
				/>

				<div className="w-full max-w-5xl">
					<SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
						{HOME_TOOLS.map((tool) => (
							<ToolCard key={tool.title} tool={tool} />
						))}
					</SimpleGrid>
				</div>

				<MagneticWrapper strength={25}>
					<Button
						variant="outline"
						size="xl"
						radius="xl"
						color="forest"
						component={Link}
						to="/dashboard"
						className="h-16 px-12 border-forest text-forest hover:bg-forest hover:text-white transition-all shadow-xl shadow-forest/5"
					>
						Explore Dashboard
					</Button>
				</MagneticWrapper>
			</Stack>
		</HomeSection>
	);
}
