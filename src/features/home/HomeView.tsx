"use client";

import { Stack } from "@mantine/core";
import { BentoSection } from "./components/BentoSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { LandingHero } from "./components/LandingHero";

export default function HomeView() {
	return (
		<Stack
			gap={0}
			className="bg-alabaster selection:bg-terracotta-100 selection:text-terracotta-900"
		>
			<LandingHero />
			<BentoSection />
			<FeaturesSection />
		</Stack>
	);
}
