"use client";

import { Stack } from "@mantine/core";
import { CapabilitiesSection } from "./components/CapabilitiesSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { LandingHero } from "./components/LandingHero";
import { ScrollPeek } from "./components/ScrollPeek";

export default function HomeView() {
	return (
		<Stack
			gap={0}
			className="relative z-[2] w-full selection: selection:"
		>
			<LandingHero />
			<FeaturesSection />
			<ScrollPeek />
			<CapabilitiesSection />
		</Stack>
	);
}
