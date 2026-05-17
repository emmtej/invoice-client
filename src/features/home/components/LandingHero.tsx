"use client";

import { Button, Group, Stack, Text } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Play } from "lucide-react";
import { initDb } from "@/features/storage/pgliteClient";
import { EyebrowPill } from "./EyebrowPill";
import { HeroVisual } from "./HeroVisual";
import { HomeSection } from "./HomeSection";

export function LandingHero() {
	return (
		<HomeSection
			className="relative overflow-x-clip"
			containerClassName="flex flex-col justify-center pt-10 pb-12 md:pt-14 md:pb-16 lg:min-h-[min(calc(100dvh-60px),880px)] lg:pt-16 lg:pb-20"
		>
			<div className="grid w-full grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-10">
				<div className="relative z-10 max-w-[58ch]">
					<Stack gap="2.5rem">
						<Stack gap="2rem">
							<EyebrowPill>Local-first studio desk</EyebrowPill>

							<h1 className="font-sans text-[2.75rem] font-bold leading-[0.95] tracking-tight md:text-5xl lg:text-6xl">
								Bill with{" "}
								<span className="font-display font-medium italic">
									precision
								</span>{" "}
								that matches the script.
							</h1>

							<Text
								c="dimmed"
								className="max-w-[32ch] text-lg leading-relaxed md:text-xl"
							>
								Parse dialogue, track booth sessions, and build invoices from word
								counts without leaving your desk.
							</Text>
						</Stack>

						<Group gap="md" wrap="wrap">
							<Button
								component={Link}
								to="/register"
								size="lg"
								onMouseEnter={() => initDb()}
							>
								Get Started
								<ArrowRight size={18} strokeWidth={1.5} />
							</Button>

							<Button
								component={Link}
								to="/editor"
								variant="subtle"
								size="lg"
								leftSection={
									<Play size={16} strokeWidth={1.5} fill="currentColor" />
								}
								onMouseEnter={() => initDb()}
							>
								Launch Editor
							</Button>
						</Group>
					</Stack>
				</div>

				<div className="relative w-full lg:z-0">
					<HeroVisual />
				</div>
			</div>
		</HomeSection>
	);
}
