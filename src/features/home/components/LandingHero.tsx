"use client";

import { Box, Button, Group, Stack, Text } from "@mantine/core";
import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";
import invoice1 from "@/assets/images/invoice-1-1920.webp";
import { MagneticWrapper } from "@/components/ui/motion/MagneticWrapper";
import { initDb } from "@/features/storage/pgliteClient";
import { HomeSection } from "./HomeSection";

export function LandingHero() {
	return (
		<HomeSection className="relative flex items-start overflow-hidden pt-12 md:pt-20 lg:pt-32 pb-24 md:pb-32 lg:pb-40">
			<div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-32 items-center w-full">
				{/* Content Side */}
				<div className="lg:col-span-7 z-10">
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
					>
						<Stack gap={0}>
							<Text
								size="xs"
								fw={700}
								tt="uppercase"
								lts="0.3em"
								c="sage.7"
								mb={40}
								className="inline-block tracking-[0.4em] opacity-80"
							>
								Local-first Studio Desk
							</Text>

							<h1
								className="font-sans text-[3.5rem] md:text-[5.5rem] lg:text-[7.5rem] font-bold leading-[0.9] tracking-tightest text-forest"
								style={{ marginBottom: "48px" }}
							>
								Bill with <br />
								<span className="font-display italic font-medium text-terracotta-700">
									clinical precision.
								</span>
							</h1>

							<Text
								className="text-xl md:text-2xl text-brand-dark-4 leading-relaxed max-w-[32ch] text-pretty"
								mb={80}
							>
								Automated script parsing and dialogue tracking. The booth-native
								invoicing stack for elite voice talent.
							</Text>

							<Group gap="xl">
								<MagneticWrapper strength={20}>
									<Button
										component={Link}
										to="/register"
										size="xl"
										radius="xl"
										color="forest"
										className="h-16 px-10 text-lg bg-forest hover:bg-forest-8 shadow-xl shadow-forest/10 active:scale-[0.98] transition-all"
										rightSection={<ArrowRight size={20} />}
										onMouseEnter={() => initDb()}
									>
										Get Started
									</Button>
								</MagneticWrapper>

								<MagneticWrapper strength={15}>
									<Button
										component={Link}
										to="/editor"
										variant="subtle"
										size="xl"
										radius="xl"
										color="forest"
										className="h-16 px-8 text-lg hover:bg-slate-50 active:scale-[0.98] transition-all"
										leftSection={<Play size={18} fill="currentColor" />}
										onMouseEnter={() => initDb()}
									>
										Launch Editor
									</Button>
								</MagneticWrapper>
							</Group>
						</Stack>
					</motion.div>
				</div>

				{/* Visual Side */}
				<div className="lg:col-span-5 relative">
					<motion.div
						initial={{ opacity: 0, scale: 0.9, rotateY: 15 }}
						animate={{ opacity: 1, scale: 1, rotateY: 0 }}
						transition={{ duration: 1.2, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
						className="relative z-10"
					>
						<Box className="aspect-[4/5] w-full rounded-[3rem] overflow-hidden border border-white/20 shadow-[0_64px_128px_-32px_rgba(45,58,49,0.25)]">
							<img
								src={invoice1}
								alt="InVoice Studio Interface"
								className="h-full w-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-1000"
							/>
							<div className="absolute inset-0 bg-gradient-to-tr from-forest/30 via-transparent to-white/10 pointer-events-none" />
						</Box>

						{/* Floating Bento Card Decor */}
						<motion.div
							animate={{ y: [0, -20, 0] }}
							transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
							className="absolute -bottom-10 -left-10 p-6 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 z-20 hidden md:block"
						>
							<Stack gap="xs">
								<div className="flex items-center gap-3">
									<div className="w-3 h-3 rounded-full bg-on-air-red-5 animate-pulse" />
									<Text fw={700} size="sm" c="brand-dark.7">
										Booth Status: Active
									</Text>
								</div>
								<Text size="xs" c="brand-dark.4">
									Tracking script #842-A
								</Text>
							</Stack>
						</motion.div>
					</motion.div>

					{/* Ambient Background Glows */}
					<div className="absolute -top-20 -right-20 w-80 h-80 bg-sage-4/10 rounded-full blur-[100px] pointer-events-none" />
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-alabaster/50 blur-3xl -z-10 pointer-events-none" />
				</div>
			</div>
		</HomeSection>
	);
}
